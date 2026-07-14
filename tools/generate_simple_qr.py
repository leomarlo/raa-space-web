#!/usr/bin/env python3
"""Generate the plain QR code used as the main chess-week entrypoint."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

import qrcode
from PIL import Image
from qrcode.constants import ERROR_CORRECT_H


DEFAULT_URL = "https://raa.space/chess-week"
DEFAULT_OUTPUT = Path("frontend/public/assets/raa-chess-week/chess-qr.png")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--module-pixels", type=int, default=18)
    parser.add_argument("--quiet-zone", type=int, default=4)
    return parser.parse_args()


def decode(path: Path) -> str:
    process = subprocess.run(
        ["zbarimg", "--quiet", "--raw", str(path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if process.returncode != 0:
        raise SystemExit(f"Generated QR code could not be decoded: {path}")
    return process.stdout.strip()


def main() -> None:
    args = parse_args()
    if args.module_pixels < 1:
        raise SystemExit("--module-pixels must be positive")
    if args.quiet_zone < 4:
        raise SystemExit("QR codes require a quiet zone of at least four modules")

    qr = qrcode.QRCode(
        error_correction=ERROR_CORRECT_H,
        box_size=args.module_pixels,
        border=args.quiet_zone,
    )
    qr.add_data(args.url)
    qr.make(fit=True)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    image.save(args.output, optimize=True)

    transparent_output = args.output.with_name(f"{args.output.stem}-transparent.png")
    transparent = image.convert("RGBA")
    pixels = transparent.getdata()
    transparent.putdata(
        [(red, green, blue, 0 if red == 255 else 255) for red, green, blue, _ in pixels]
    )
    transparent.save(transparent_output, optimize=True)

    decoded_value = decode(args.output)
    if decoded_value != args.url:
        raise SystemExit(
            f"Generated QR code decoded to {decoded_value!r}, expected {args.url!r}"
        )

    report = {
        "encoded_url": args.url,
        "qr_version": qr.version,
        "module_count": qr.modules_count,
        "error_correction": "H",
        "module_pixels": args.module_pixels,
        "quiet_zone": args.quiet_zone,
        "decoder": "zbarimg",
        "decoded_value": decoded_value,
        "output": str(args.output),
        "transparent_output": str(transparent_output),
    }
    report_path = args.output.with_suffix(".json")
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
