#!/usr/bin/env python3
"""Find a valid QR code with the strongest global checkerboard texture.

Every overlapping 2x2 window scores one point when it is one of the two
alternating checker patterns. Candidates vary a harmless URL-fragment nonce
and all eight QR masks. No modules are changed after encoding.
"""

from __future__ import annotations

import argparse
import heapq
import json
from dataclasses import asdict, dataclass
from pathlib import Path

from generate_chess_qr import decode_with_zbar, make_qr, render_matrix


Matrix = list[list[bool]]
DEFAULT_URL = "https://raa.space/c"
DEFAULT_OUTPUT = Path("frontend/public/assets/raa-chess-week/chess-qr.png")
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"


@dataclass
class Candidate:
    nonce: int
    nonce_text: str
    mask: int
    encoded_url: str
    version: int
    alternating_windows: int
    largest_connected_region: int
    central_alternating_windows: int
    matrix: Matrix


@dataclass
class Report:
    encoded_url: str
    base_url: str
    nonce: int
    nonce_text: str
    mask: int
    qr_version: int
    module_count: int
    alternating_windows: int
    total_windows: int
    alternating_percent: float
    largest_connected_region: int
    central_alternating_windows: int
    central_total_windows: int
    central_alternating_percent: float
    changed_modules: int
    decoder: str
    decoded_value: str
    iterations: int
    candidates_evaluated: int
    output: str


def base36(value: int, width: int) -> str:
    if value < 0:
        raise ValueError("nonce must be non-negative")
    digits: list[str] = []
    while value:
        value, remainder = divmod(value, len(ALPHABET))
        digits.append(ALPHABET[remainder])
    encoded = "".join(reversed(digits or ["0"]))
    if len(encoded) > width:
        raise ValueError("nonce does not fit the selected width")
    return encoded.rjust(width, "0")


def alternating_window(matrix: Matrix, row: int, col: int) -> bool:
    top_left = matrix[row][col]
    top_right = matrix[row][col + 1]
    bottom_left = matrix[row + 1][col]
    bottom_right = matrix[row + 1][col + 1]
    return (
        top_left == bottom_right
        and top_right == bottom_left
        and top_left != top_right
    )


def successful_windows(matrix: Matrix) -> set[tuple[int, int]]:
    size = len(matrix)
    return {
        (row, col)
        for row in range(size - 1)
        for col in range(size - 1)
        if alternating_window(matrix, row, col)
    }


def largest_connected_region(windows: set[tuple[int, int]]) -> int:
    remaining = set(windows)
    largest = 0
    while remaining:
        start = remaining.pop()
        stack = [start]
        size = 1
        while stack:
            row, col = stack.pop()
            for neighbour in (
                (row - 1, col),
                (row + 1, col),
                (row, col - 1),
                (row, col + 1),
            ):
                if neighbour in remaining:
                    remaining.remove(neighbour)
                    stack.append(neighbour)
                    size += 1
        largest = max(largest, size)
    return largest


def central_bounds(module_count: int) -> tuple[int, int]:
    # A centred square covering approximately the middle half of the symbol.
    start = module_count // 4
    stop = module_count - start - 1
    return start, stop


def score_candidate(nonce: int, nonce_text: str, mask: int, url: str, matrix: Matrix) -> Candidate:
    windows = successful_windows(matrix)
    start, stop = central_bounds(len(matrix))
    central = sum(start <= row < stop and start <= col < stop for row, col in windows)
    return Candidate(
        nonce=nonce,
        nonce_text=nonce_text,
        mask=mask,
        encoded_url=url,
        version=(len(matrix) - 17) // 4,
        alternating_windows=len(windows),
        largest_connected_region=largest_connected_region(windows),
        central_alternating_windows=central,
        matrix=matrix,
    )


def rank(candidate: Candidate) -> tuple[int, int, int, int]:
    return (
        candidate.alternating_windows,
        candidate.largest_connected_region,
        candidate.central_alternating_windows,
        -candidate.nonce,
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--iterations", type=int, default=12_000)
    parser.add_argument("--nonce-width", type=int, default=4)
    parser.add_argument("--version", type=int, default=3)
    parser.add_argument("--finalists", type=int, default=64)
    parser.add_argument("--module-pixels", type=int, default=18)
    parser.add_argument("--quiet-zone", type=int, default=4)
    parser.add_argument("--dark", default="#000000")
    parser.add_argument("--light", default="#ffffff")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.iterations < 1 or args.finalists < 1:
        raise SystemExit("--iterations and --finalists must be positive")
    if args.quiet_zone < 4:
        raise SystemExit("QR Code requires a quiet zone of at least four modules")
    if args.iterations > len(ALPHABET) ** args.nonce_width:
        raise SystemExit("--iterations exceeds the fixed-width nonce space")

    heap: list[tuple[tuple[int, int, int, int], int, Candidate]] = []
    serial = 0
    for nonce in range(args.iterations):
        nonce_text = base36(nonce, args.nonce_width)
        url = f"{args.url}#{nonce_text}"
        for mask in range(8):
            version, matrix = make_qr(url, mask=mask, version=args.version)
            if version != args.version:
                raise RuntimeError("Candidate did not use the requested QR version")
            candidate = score_candidate(nonce, nonce_text, mask, url, matrix)
            item = (rank(candidate), serial, candidate)
            if len(heap) < args.finalists:
                heapq.heappush(heap, item)
            elif item[0] > heap[0][0]:
                heapq.heapreplace(heap, item)
            serial += 1

    selected: Candidate | None = None
    decoded_value = ""
    for _candidate_rank, _serial, candidate in sorted(heap, reverse=True):
        render_matrix(
            candidate.matrix,
            args.output,
            args.module_pixels,
            args.quiet_zone,
            args.dark,
            args.light,
        )
        decoded = decode_with_zbar(args.output)
        if decoded == candidate.encoded_url:
            selected = candidate
            decoded_value = decoded
            break

    if selected is None:
        raise SystemExit("No finalist decoded successfully")

    size = len(selected.matrix)
    total_windows = (size - 1) ** 2
    central_start, central_stop = central_bounds(size)
    central_total = (central_stop - central_start) ** 2
    report = Report(
        encoded_url=selected.encoded_url,
        base_url=args.url,
        nonce=selected.nonce,
        nonce_text=selected.nonce_text,
        mask=selected.mask,
        qr_version=selected.version,
        module_count=size,
        alternating_windows=selected.alternating_windows,
        total_windows=total_windows,
        alternating_percent=selected.alternating_windows / total_windows * 100,
        largest_connected_region=selected.largest_connected_region,
        central_alternating_windows=selected.central_alternating_windows,
        central_total_windows=central_total,
        central_alternating_percent=selected.central_alternating_windows / central_total * 100,
        changed_modules=0,
        decoder="zbarimg",
        decoded_value=decoded_value,
        iterations=args.iterations,
        candidates_evaluated=args.iterations * 8,
        output=str(args.output),
    )
    report_path = args.output.with_suffix(".json")
    report_path.write_text(json.dumps(asdict(report), indent=2) + "\n", encoding="utf-8")
    print(json.dumps(asdict(report), indent=2))
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
