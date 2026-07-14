#!/usr/bin/env python3
"""Generate small, separate QR-fragment SVG assets in two polarities."""

from __future__ import annotations

from pathlib import Path


OUTPUT_DIR = Path("frontend/public/assets/raa-chess-week/qr-shapes")
SHAPES = (
    ("010", "111", "110", "110", "010", "100"),
    ("000", "111", "011", "110", "000", "000"),
    ("000", "100", "110", "000", "000", "000"),
    ("000", "010", "111", "011", "000", "000"),
)


def render_shape(pattern: tuple[str, ...], filled_value: str, fill: str) -> str:
    width = len(pattern[0])
    height = len(pattern)
    rectangles: list[str] = []

    for row, values in enumerate(pattern):
        for col, value in enumerate(values):
            if value == filled_value:
                rectangles.append(f'  <rect x="{col}" y="{row}" width="1" height="1"/>')

    body = "\n".join(rectangles)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" shape-rendering="crispEdges">\n'
        f'<g fill="{fill}">\n{body}\n</g>\n'
        "</svg>\n"
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for extension in ("*.png", "*.svg"):
        for old_output in OUTPUT_DIR.glob(extension):
            old_output.unlink()

    for index, pattern in enumerate(SHAPES, start=1):
        if len(pattern) != 6 or any(len(row) != 3 for row in pattern):
            raise SystemExit(f"Shape {index} is not a 3x6 matrix")
        variants = (
            ("black-on-transparent", "1", "#000000"),
            ("transparent-on-black", "0", "#000000"),
            ("b29c83-on-transparent", "1", "#b29c83"),
            ("6a665c-on-transparent", "1", "#6a665c"),
        )
        for polarity, filled_value, fill in variants:
            output = OUTPUT_DIR / f"{polarity}-shape-{index:02d}-3x6.svg"
            output.write_text(
                render_shape(pattern, filled_value, fill),
                encoding="utf-8",
            )
            print(output)


if __name__ == "__main__":
    main()
