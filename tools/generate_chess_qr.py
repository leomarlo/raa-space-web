#!/usr/bin/env python3
"""Search for a robust QR code with a chessboard-like centre.

The generator varies a harmless URL fragment nonce and all eight QR mask
patterns. It searches for a symbol whose unmodified centre already resembles
an 18x18 target: a one-module white rim around an 8x8 alternating board whose
fields are 2x2 QR modules. It then changes at most ``--max-changes`` data
modules, never QR function modules, and uses zbarimg (when available) to reject
candidates that no longer decode.

Example:
    python tools/generate_chess_qr.py --iterations 20000
"""

from __future__ import annotations

import argparse
import heapq
import json
import shutil
import subprocess
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

import qrcode
from PIL import Image, ImageDraw
from qrcode.constants import ERROR_CORRECT_H
from qrcode.util import pattern_position


Matrix = list[list[bool]]
DEFAULT_URL = "https://raa.space/chess-week"
DEFAULT_OUTPUT = Path(
    "frontend/public/assets/raa-chess-week/chess-qr.png"
)


@dataclass
class Candidate:
    nonce: int
    mask: int
    encoded_url: str
    version: int
    raw_matches: int
    raw_weighted_score: float
    raw_recognition_score: float
    raw_rim_matches: int
    raw_completed_squares: int
    raw_near_complete_squares: int
    mismatches: list[tuple[int, int, bool, bool, float]]
    matrix: Matrix


@dataclass
class Result:
    encoded_url: str
    base_url: str
    nonce: int
    mask: int
    qr_version: int
    module_count: int
    target_origin: tuple[int, int]
    target_size: int
    raw_matches: int
    raw_match_percent: float
    final_matches: int
    final_match_percent: float
    raw_weighted_percent: float
    final_weighted_percent: float
    raw_recognition_percent: float
    final_recognition_percent: float
    raw_rim_matches: int
    final_rim_matches: int
    rim_modules: int
    raw_completed_squares: int
    final_completed_squares: int
    raw_near_complete_squares: int
    final_near_complete_squares: int
    changed_modules: int
    max_changes: int
    decoder: str
    decoded_value: str
    output: str


def encoded_url(base_url: str, nonce: int, nonce_width: int) -> str:
    """Append a fixed-width fragment that does not change the requested page."""
    separator = "&" if "#" in base_url else "#"
    return f"{base_url}{separator}q{nonce:0{nonce_width}x}"


def make_qr(data: str, mask: int, version: int | None = None) -> tuple[int, Matrix]:
    qr = qrcode.QRCode(
        version=version,
        error_correction=ERROR_CORRECT_H,
        box_size=1,
        border=0,
        mask_pattern=mask,
    )
    qr.add_data(data)
    qr.make(fit=version is None)
    return qr.version, [[bool(value) for value in row] for row in qr.modules]


def mark_rect(mask: Matrix, row: int, col: int, height: int, width: int) -> None:
    size = len(mask)
    for y in range(max(0, row), min(size, row + height)):
        for x in range(max(0, col), min(size, col + width)):
            mask[y][x] = True


def function_module_mask(version: int) -> Matrix:
    """Return QR function modules that must never be artistically changed."""
    size = 17 + 4 * version
    protected = [[False] * size for _ in range(size)]

    # Finder patterns plus their one-module separators.
    mark_rect(protected, 0, 0, 9, 9)
    mark_rect(protected, 0, size - 8, 9, 8)
    mark_rect(protected, size - 8, 0, 8, 9)

    # Timing patterns.
    mark_rect(protected, 6, 0, 1, size)
    mark_rect(protected, 0, 6, size, 1)

    # Alignment patterns. Patterns overlapping finder regions are omitted by
    # the QR encoder; marking them anyway is conservative and harmless.
    positions = pattern_position(version)
    for row in positions:
        for col in positions:
            if protected[row][col]:
                continue
            mark_rect(protected, row - 2, col - 2, 5, 5)

    # Format information beside the finders and the fixed dark module.
    mark_rect(protected, 8, 0, 1, 9)
    mark_rect(protected, 0, 8, 9, 1)
    mark_rect(protected, 8, size - 8, 1, 8)
    mark_rect(protected, size - 8, 8, 8, 1)
    protected[size - 8][8] = True

    # Version information exists from version 7 onward.
    if version >= 7:
        mark_rect(protected, 0, size - 11, 6, 3)
        mark_rect(protected, size - 11, 0, 3, 6)

    return protected


def chess_target(cell_size: int = 2, rim: int = 1) -> Matrix:
    """Build an 8x8 board with square fields of ``cell_size`` modules."""
    board_size = 8 * cell_size
    target_size = board_size + 2 * rim
    target = [[False] * target_size for _ in range(target_size)]
    for board_row in range(8):
        for board_col in range(8):
            desired = (board_row + board_col) % 2 == 0
            for dy in range(cell_size):
                for dx in range(cell_size):
                    target[rim + board_row * cell_size + dy][
                        rim + board_col * cell_size + dx
                    ] = desired
    return target


def target_cells(
    matrix: Matrix, protected: Matrix, target: Matrix
) -> tuple[tuple[int, int], list[tuple[int, int, bool, bool, float]]]:
    qr_size = len(matrix)
    target_size = len(target)
    origin = ((qr_size - target_size) // 2, (qr_size - target_size) // 2)
    origin_row, origin_col = origin
    cells: list[tuple[int, int, bool, bool, float]] = []

    for target_row in range(target_size):
        for target_col in range(target_size):
            row = origin_row + target_row
            col = origin_col + target_col
            if protected[row][col]:
                raise ValueError(
                    f"The 10x10 centre overlaps required QR function module ({row}, {col})"
                )
            rim = target_row in (0, target_size - 1) or target_col in (0, target_size - 1)
            weight = 2.5 if rim else 1.0
            cells.append((row, col, matrix[row][col], target[target_row][target_col], weight))
    return origin, cells


def score_candidate(
    nonce: int,
    mask: int,
    data: str,
    version: int,
    matrix: Matrix,
    protected: Matrix,
    target: Matrix,
) -> Candidate:
    _, cells = target_cells(matrix, protected, target)
    matches = sum(current == desired for _, _, current, desired, _ in cells)
    total_weight = sum(weight for *_, weight in cells)
    matched_weight = sum(
        weight for _, _, current, desired, weight in cells if current == desired
    )
    mismatches = [cell for cell in cells if cell[2] != cell[3]]
    stats = recognition_stats(matrix, protected, target)
    return Candidate(
        nonce=nonce,
        mask=mask,
        encoded_url=data,
        version=version,
        raw_matches=matches,
        raw_weighted_score=matched_weight / total_weight,
        raw_recognition_score=stats["recognition_score"],
        raw_rim_matches=stats["rim_matches"],
        raw_completed_squares=stats["completed_squares"],
        raw_near_complete_squares=stats["near_complete_squares"],
        mismatches=mismatches,
        matrix=matrix,
    )


def board_square_cells(
    matrix: Matrix, target: Matrix, cell_size: int = 2, rim: int = 1
) -> list[list[tuple[int, int, bool]]]:
    qr_size = len(matrix)
    target_size = len(target)
    origin_row = (qr_size - target_size) // 2
    origin_col = (qr_size - target_size) // 2
    squares: list[list[tuple[int, int, bool]]] = []
    for board_row in range(8):
        for board_col in range(8):
            cells: list[tuple[int, int, bool]] = []
            for dy in range(cell_size):
                for dx in range(cell_size):
                    target_row = rim + board_row * cell_size + dy
                    target_col = rim + board_col * cell_size + dx
                    cells.append(
                        (
                            origin_row + target_row,
                            origin_col + target_col,
                            target[target_row][target_col],
                        )
                    )
            squares.append(cells)
    return squares


def recognition_stats(matrix: Matrix, protected: Matrix, target: Matrix) -> dict[str, float | int]:
    origin, cells = target_cells(matrix, protected, target)
    target_size = len(target)
    origin_row, origin_col = origin
    rim_cells = [
        cell
        for cell in cells
        if cell[0] in (origin_row, origin_row + target_size - 1)
        or cell[1] in (origin_col, origin_col + target_size - 1)
    ]
    rim_matches = sum(current == desired for _, _, current, desired, _ in rim_cells)
    square_match_counts: list[int] = []
    for square in board_square_cells(matrix, target):
        square_match_counts.append(
            sum(matrix[row][col] == desired for row, col, desired in square)
        )
    completed = sum(count == 4 for count in square_match_counts)
    near_complete = sum(count == 3 for count in square_match_counts)
    # Squaring each field's match fraction strongly rewards coherent 2x2 fields.
    coherence = sum((count / 4) ** 2 for count in square_match_counts) / 64
    rim_fraction = rim_matches / len(rim_cells)
    recognition = 0.20 * rim_fraction + 0.80 * coherence
    return {
        "rim_matches": rim_matches,
        "rim_modules": len(rim_cells),
        "completed_squares": completed,
        "near_complete_squares": near_complete,
        "square_coherence": coherence,
        "recognition_score": recognition,
    }


def apply_artistic_changes(candidate: Candidate, max_changes: int, target: Matrix) -> Matrix:
    matrix = [row[:] for row in candidate.matrix]
    target_size = len(target)
    origin = (len(matrix) - target_size) // 2

    # Reserve one quarter of the budget for the white boundary. The remainder
    # is spent only in atomic groups that complete entire 2x2 fields.
    rim_budget = max_changes // 4
    board_budget = max_changes - rim_budget
    actions: list[tuple[float, int, list[tuple[int, int, bool]]]] = []
    for square in board_square_cells(matrix, target):
        changes = [(row, col, desired) for row, col, desired in square if matrix[row][col] != desired]
        if not changes:
            continue
        before = (1 - len(changes) / 4) ** 2
        recognition_gain = 0.80 * (1 - before) / 64
        actions.append((recognition_gain / len(changes), len(changes), changes))

    actions.sort(key=lambda action: (action[0], -action[1]), reverse=True)
    spent = 0
    changed: set[tuple[int, int]] = set()
    for _value, _cost, changes in actions:
        new_changes = [change for change in changes if (change[0], change[1]) not in changed]
        if not new_changes or spent + len(new_changes) > board_budget:
            continue
        for row, col, desired in new_changes:
            matrix[row][col] = desired
            changed.add((row, col))
        spent += len(new_changes)

    # Prefer rim gaps beside existing white modules so the limited corrections
    # extend visible runs instead of creating isolated white dots.
    rim_actions: list[tuple[int, int, int, bool]] = []
    for row, col, current, desired, _weight in candidate.mismatches:
        target_row = row - origin
        target_col = col - origin
        if target_row in (0, target_size - 1) or target_col in (0, target_size - 1):
            neighbours = 0
            for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                adjacent_row, adjacent_col = row + dy, col + dx
                if 0 <= adjacent_row < len(matrix) and 0 <= adjacent_col < len(matrix):
                    neighbours += matrix[adjacent_row][adjacent_col] is False
            rim_actions.append((neighbours, row, col, desired))
    rim_actions.sort(reverse=True)
    for _neighbours, row, col, desired in rim_actions[:rim_budget]:
        matrix[row][col] = desired
    return matrix


def render_matrix(
    matrix: Matrix,
    path: Path,
    module_pixels: int,
    quiet_zone: int,
    dark: str,
    light: str,
) -> None:
    symbol_size = len(matrix)
    image_size = (symbol_size + quiet_zone * 2) * module_pixels
    image = Image.new("RGB", (image_size, image_size), light)
    draw = ImageDraw.Draw(image)
    for row, values in enumerate(matrix):
        for col, value in enumerate(values):
            if not value:
                continue
            x0 = (col + quiet_zone) * module_pixels
            y0 = (row + quiet_zone) * module_pixels
            draw.rectangle(
                (x0, y0, x0 + module_pixels - 1, y0 + module_pixels - 1),
                fill=dark,
            )
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def decode_with_zbar(path: Path) -> str | None:
    executable = shutil.which("zbarimg")
    if not executable:
        return None
    process = subprocess.run(
        [executable, "--quiet", "--raw", str(path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if process.returncode != 0:
        return ""
    return process.stdout.strip()


def candidate_rank(candidate: Candidate) -> tuple[float, int, int, float, int]:
    return (
        candidate.raw_recognition_score,
        candidate.raw_completed_squares,
        candidate.raw_near_complete_squares,
        candidate.raw_weighted_score,
        -candidate.nonce,
    )


def retain_best(
    heap: list[tuple[tuple[float, int, int, float, int], int, Candidate]],
    candidate: Candidate,
    count: int,
    serial: int,
) -> None:
    item = (candidate_rank(candidate), serial, candidate)
    if len(heap) < count:
        heapq.heappush(heap, item)
    elif item[0] > heap[0][0]:
        heapq.heapreplace(heap, item)


def weighted_percent(matrix: Matrix, protected: Matrix, target: Matrix) -> float:
    _, cells = target_cells(matrix, protected, target)
    total = sum(weight for *_, weight in cells)
    matched = sum(weight for _, _, current, desired, weight in cells if current == desired)
    return matched / total * 100


def exact_matches(matrix: Matrix, protected: Matrix, target: Matrix) -> int:
    _, cells = target_cells(matrix, protected, target)
    return sum(current == desired for _, _, current, desired, _ in cells)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--iterations", type=int, default=20_000)
    parser.add_argument("--nonce-width", type=int, default=6)
    parser.add_argument("--max-changes", type=int, default=16)
    parser.add_argument("--finalists", type=int, default=64)
    parser.add_argument("--module-pixels", type=int, default=16)
    parser.add_argument("--quiet-zone", type=int, default=4)
    parser.add_argument("--dark", default="#000000")
    parser.add_argument("--light", default="#ffffff")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--allow-unvalidated",
        action="store_true",
        help="Allow output when zbarimg is unavailable; never bypass a decode failure.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.iterations < 1 or args.finalists < 1:
        raise SystemExit("--iterations and --finalists must be positive")
    if not 0 <= args.max_changes <= 100:
        raise SystemExit("--max-changes must be between 0 and 100")
    if args.quiet_zone < 4:
        raise SystemExit("QR Code requires a quiet zone of at least four modules")

    target = chess_target()
    sample_url = encoded_url(args.url, 0, args.nonce_width)
    version, _sample_matrix = make_qr(sample_url, mask=0)
    protected = function_module_mask(version)
    target_cells(_sample_matrix, protected, target)  # Fail early on overlap.

    heap: list[tuple[tuple[float, int, int, float, int], int, Candidate]] = []
    serial = 0
    for nonce in range(args.iterations):
        data = encoded_url(args.url, nonce, args.nonce_width)
        for mask in range(8):
            candidate_version, matrix = make_qr(data, mask=mask, version=version)
            if candidate_version != version:
                raise RuntimeError("Fixed-width nonce unexpectedly changed the QR version")
            candidate = score_candidate(
                nonce, mask, data, version, matrix, protected, target
            )
            retain_best(heap, candidate, args.finalists, serial)
            serial += 1

    finalists = [item[2] for item in sorted(heap, reverse=True)]
    zbar_available = shutil.which("zbarimg") is not None
    if not zbar_available and not args.allow_unvalidated:
        raise SystemExit(
            "zbarimg is required for post-overlay validation; install it or use "
            "--allow-unvalidated explicitly"
        )

    selected: Candidate | None = None
    selected_matrix: Matrix | None = None
    decoded_value = ""
    with tempfile.TemporaryDirectory(prefix="chess-qr-") as temp_dir:
        validation_path = Path(temp_dir) / "candidate.png"
        for candidate in finalists:
            artistic_matrix = apply_artistic_changes(candidate, args.max_changes, target)
            render_matrix(
                artistic_matrix,
                validation_path,
                args.module_pixels,
                args.quiet_zone,
                args.dark,
                args.light,
            )
            decoded = decode_with_zbar(validation_path)
            if decoded is None and args.allow_unvalidated:
                selected, selected_matrix, decoded_value = candidate, artistic_matrix, "not tested"
                break
            if decoded == candidate.encoded_url:
                selected, selected_matrix, decoded_value = candidate, artistic_matrix, decoded
                break

    if selected is None or selected_matrix is None:
        raise SystemExit(
            "None of the retained candidates decoded after alteration. Reduce "
            "--max-changes or increase --iterations/--finalists."
        )

    render_matrix(
        selected_matrix,
        args.output,
        args.module_pixels,
        args.quiet_zone,
        args.dark,
        args.light,
    )
    origin, _ = target_cells(selected_matrix, protected, target)
    final_matches = exact_matches(selected_matrix, protected, target)
    result = Result(
        encoded_url=selected.encoded_url,
        base_url=args.url,
        nonce=selected.nonce,
        mask=selected.mask,
        qr_version=selected.version,
        module_count=len(selected.matrix),
        target_origin=origin,
        target_size=len(target),
        raw_matches=selected.raw_matches,
        raw_match_percent=selected.raw_matches / (len(target) ** 2) * 100,
        final_matches=final_matches,
        final_match_percent=final_matches / (len(target) ** 2) * 100,
        raw_weighted_percent=selected.raw_weighted_score * 100,
        final_weighted_percent=weighted_percent(selected_matrix, protected, target),
        raw_recognition_percent=selected.raw_recognition_score * 100,
        final_recognition_percent=float(recognition_stats(selected_matrix, protected, target)["recognition_score"]) * 100,
        raw_rim_matches=selected.raw_rim_matches,
        final_rim_matches=int(recognition_stats(selected_matrix, protected, target)["rim_matches"]),
        rim_modules=int(recognition_stats(selected_matrix, protected, target)["rim_modules"]),
        raw_completed_squares=selected.raw_completed_squares,
        final_completed_squares=int(recognition_stats(selected_matrix, protected, target)["completed_squares"]),
        raw_near_complete_squares=selected.raw_near_complete_squares,
        final_near_complete_squares=int(recognition_stats(selected_matrix, protected, target)["near_complete_squares"]),
        changed_modules=sum(
            selected.matrix[row][col] != selected_matrix[row][col]
            for row in range(len(selected.matrix))
            for col in range(len(selected.matrix))
        ),
        max_changes=args.max_changes,
        decoder="zbarimg" if zbar_available else "none",
        decoded_value=decoded_value,
        output=str(args.output),
    )
    report_path = args.output.with_suffix(".json")
    report_path.write_text(json.dumps(asdict(result), indent=2) + "\n", encoding="utf-8")
    print(json.dumps(asdict(result), indent=2))
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
