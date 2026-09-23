#!/usr/bin/env python3
"""Generate a QR code as a transparent SVG in the RAA theme colour.

    python3 make_qr.py https://raa.space/raa-ceturdienas
    python3 make_qr.py <url> out.svg --size 40mm --ecc H --colour '#070301'

No QR library is installed here, so this is a self-contained encoder for
byte-mode QR, versions 1-6 (ISO/IEC 18004).  Run with --selftest to check the
Reed-Solomon, the BCH format bits and a full encode/decode round trip.
"""
import sys

# --- GF(256), primitive polynomial 0x11D ---------------------------------------
EXP = [0] * 512
LOG = [0] * 256
_x = 1
for _i in range(255):
    EXP[_i] = _x
    LOG[_x] = _i
    _x <<= 1
    if _x & 0x100:
        _x ^= 0x11D
for _i in range(255, 512):
    EXP[_i] = EXP[_i - 255]


def gf_mul(a, b):
    return 0 if a == 0 or b == 0 else EXP[LOG[a] + LOG[b]]


def poly_mul(p, q):
    out = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            out[i + j] ^= gf_mul(a, b)
    return out


def rs_generator(n):
    g = [1]
    for i in range(n):
        g = poly_mul(g, [1, EXP[i]])
    return g


def rs_remainder(data, n):
    """Remainder of data(x)*x^n divided by the generator of degree n."""
    g = rs_generator(n)
    rem = list(data) + [0] * n
    for i in range(len(data)):
        c = rem[i]
        if c:
            for j, gj in enumerate(g):
                rem[i + j] ^= gf_mul(gj, c)
    return rem[len(data):]


# --- error-correction tables, versions 1-6 -------------------------------------
# version -> level -> (ec codewords per block, [(block count, data codewords), ...])
ECC = {
    1: {"L": (7, [(1, 19)]), "M": (10, [(1, 16)]), "Q": (13, [(1, 13)]), "H": (17, [(1, 9)])},
    2: {"L": (10, [(1, 34)]), "M": (16, [(1, 28)]), "Q": (22, [(1, 22)]), "H": (28, [(1, 16)])},
    3: {"L": (15, [(1, 55)]), "M": (26, [(1, 44)]), "Q": (18, [(2, 17)]), "H": (22, [(2, 13)])},
    4: {"L": (20, [(1, 80)]), "M": (18, [(2, 32)]), "Q": (26, [(2, 24)]), "H": (16, [(4, 9)])},
    5: {"L": (26, [(1, 108)]), "M": (24, [(2, 43)]), "Q": (18, [(2, 15), (2, 16)]),
        "H": (22, [(2, 11), (2, 12)])},
    6: {"L": (18, [(2, 68)]), "M": (16, [(4, 27)]), "Q": (24, [(4, 19)]), "H": (28, [(4, 15)])},
}
ALIGN = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34]}
LEVEL_BITS = {"L": 0b01, "M": 0b00, "Q": 0b11, "H": 0b10}


def data_codewords(version, level):
    return sum(c * d for c, d in ECC[version][level][1])


def capacity_bytes(version, level):
    return (data_codewords(version, level) * 8 - 12) // 8


def choose(nbytes, level=None):
    """Smallest version at the strongest level that still fits."""
    order = [level] if level else ["H", "Q", "M", "L"]
    for v in sorted(ECC):
        for lv in order:
            if nbytes <= capacity_bytes(v, lv):
                return v, lv
    raise ValueError(f"{nbytes} bytes does not fit in versions 1-6")


def encode_codewords(payload, version, level):
    """Mode + count + data + padding, then interleaved data and EC codewords."""
    bits = []

    def put(value, n):
        for i in range(n - 1, -1, -1):
            bits.append((value >> i) & 1)

    put(0b0100, 4)                      # byte mode
    put(len(payload), 8)                # count, 8 bits for versions 1-9
    for byte in payload:
        put(byte, 8)
    total = data_codewords(version, level) * 8
    put(0, min(4, total - len(bits)))   # terminator
    while len(bits) % 8:
        bits.append(0)
    words = [int("".join(str(b) for b in bits[i:i + 8]), 2) for i in range(0, len(bits), 8)]
    for pad in ([0xEC, 0x11] * total)[: data_codewords(version, level) - len(words)]:
        words.append(pad)

    ec_len, groups = ECC[version][level]
    blocks, ecs, at = [], [], 0
    for count, size in groups:
        for _ in range(count):
            block = words[at:at + size]
            at += size
            blocks.append(block)
            ecs.append(rs_remainder(block, ec_len))
    out = []
    for i in range(max(len(b) for b in blocks)):
        for b in blocks:
            if i < len(b):
                out.append(b[i])
    for i in range(ec_len):
        for e in ecs:
            out.append(e[i])
    return out, blocks, ecs


# --- matrix -------------------------------------------------------------------
def _blank(version):
    n = 17 + 4 * version
    return [[None] * n for _ in range(n)], n


def _function_modules(m, n, version):
    def finder(r0, c0):
        for r in range(-1, 8):
            for c in range(-1, 8):
                if 0 <= r0 + r < n and 0 <= c0 + c < n:
                    inside = (0 <= r <= 6 and 0 <= c <= 6)
                    ring = inside and (r in (0, 6) or c in (0, 6) or (2 <= r <= 4 and 2 <= c <= 4))
                    m[r0 + r][c0 + c] = 1 if ring else 0
    finder(0, 0)
    finder(0, n - 7)
    finder(n - 7, 0)
    for i in range(8, n - 8):                       # timing
        bit = 1 - (i % 2)
        m[6][i] = bit
        m[i][6] = bit
    centres = ALIGN[version]
    for r in centres:
        for c in centres:
            if (r < 9 and c < 9) or (r < 9 and c > n - 10) or (r > n - 10 and c < 9):
                continue
            for dr in range(-2, 3):
                for dc in range(-2, 3):
                    m[r + dr][c + dc] = 1 if max(abs(dr), abs(dc)) != 1 else 0
    for i in range(9):                              # reserve format areas
        if m[8][i] is None:
            m[8][i] = 0
        if m[i][8] is None:
            m[i][8] = 0
    for i in range(8):
        if m[8][n - 1 - i] is None:
            m[8][n - 1 - i] = 0
        if m[n - 1 - i][8] is None:
            m[n - 1 - i][8] = 0
    m[n - 8][8] = 1                                 # dark module


def _reserved(n, version):
    """Mask of which cells are function modules (True) -- built from a blank grid."""
    m, _ = _blank(version)
    _function_modules(m, n, version)
    return [[m[r][c] is not None for c in range(n)] for r in range(n)]


def _place_data(m, n, reserved, stream):
    bits = [(w >> i) & 1 for w in stream for i in range(7, -1, -1)]
    idx = 0
    up = True
    col = n - 1
    while col > 0:
        if col == 6:                                # skip the vertical timing column
            col -= 1
        rows = range(n - 1, -1, -1) if up else range(n)
        for r in rows:
            for c in (col, col - 1):
                if not reserved[r][c]:
                    m[r][c] = bits[idx] if idx < len(bits) else 0
                    idx += 1
        up = not up
        col -= 2
    return idx


MASKS = [
    lambda r, c: (r + c) % 2 == 0,
    lambda r, c: r % 2 == 0,
    lambda r, c: c % 3 == 0,
    lambda r, c: (r + c) % 3 == 0,
    lambda r, c: (r // 2 + c // 3) % 2 == 0,
    lambda r, c: (r * c) % 2 + (r * c) % 3 == 0,
    lambda r, c: ((r * c) % 2 + (r * c) % 3) % 2 == 0,
    lambda r, c: ((r + c) % 2 + (r * c) % 3) % 2 == 0,
]


def _penalty(m, n):
    score = 0
    for line in [[m[r][c] for c in range(n)] for r in range(n)] + \
                [[m[r][c] for r in range(n)] for c in range(n)]:
        run, prev = 1, line[0]
        for v in line[1:]:
            if v == prev:
                run += 1
            else:
                if run >= 5:
                    score += 3 + (run - 5)
                run, prev = 1, v
        if run >= 5:
            score += 3 + (run - 5)
        s = "".join(str(v) for v in line)
        score += 40 * (s.count("1011101000010") + s.count("0100001011101")
                       + s.count("10111010000") + s.count("00001011101"))
    for r in range(n - 1):
        for c in range(n - 1):
            if m[r][c] == m[r][c + 1] == m[r + 1][c] == m[r + 1][c + 1]:
                score += 3
    dark = sum(sum(row) for row in m)
    score += 10 * (abs(dark * 100 // (n * n) - 50) // 5)
    return score


def _format_bits(level, mask):
    data = (LEVEL_BITS[level] << 3) | mask
    rem = data << 10
    for i in range(4, -1, -1):
        if rem & (1 << (i + 10)):
            rem ^= 0b10100110111 << i
    return ((data << 10) | rem) ^ 0b101010000010010


def _place_format(m, n, level, mask):
    f = _format_bits(level, mask)
    bit = lambda i: (f >> i) & 1
    for i in range(6):
        m[8][i] = bit(14 - i)
    m[8][7] = bit(8)
    m[8][8] = bit(7)
    m[7][8] = bit(6)
    for i in range(6):
        m[5 - i][8] = bit(5 - i)
    for i in range(7):
        m[n - 1 - i][8] = bit(i)
    for i in range(8):
        m[8][n - 8 + i] = bit(7 + i)
    m[n - 8][8] = 1


def make_matrix(text, level=None):
    payload = text.encode("utf-8")
    version, level = choose(len(payload), level)
    stream, _, _ = encode_codewords(payload, version, level)
    reserved = _reserved(17 + 4 * version, version)
    best = None
    for mask in range(8):
        m, n = _blank(version)
        _function_modules(m, n, version)
        _place_data(m, n, reserved, stream)
        for r in range(n):
            for c in range(n):
                if not reserved[r][c] and MASKS[mask](r, c):
                    m[r][c] ^= 1
        _place_format(m, n, level, mask)
        p = _penalty(m, n)
        if best is None or p < best[0]:
            best = (p, m, mask)
    return best[1], version, level, best[2]


def to_svg(matrix, colour="#070301", quiet=4, size="40mm", title=None, bg=None):
    """bg=None leaves the background transparent; otherwise it fills the quiet zone too,
    which scanners need -- the margin must read as the light side of the code."""
    n = len(matrix)
    total = n + 2 * quiet
    parts = []
    for r in range(n):
        c = 0
        while c < n:                                # merge horizontal runs
            if matrix[r][c]:
                c0 = c
                while c < n and matrix[r][c]:
                    c += 1
                parts.append(f"M{c0 + quiet} {r + quiet}h{c - c0}v1h-{c - c0}z")
            else:
                c += 1
    dim = f' width="{size}" height="{size}"' if size else ""
    head = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total} {total}"{dim} '
            f'shape-rendering="crispEdges">\n')
    if title:
        head += f"  <title>{title}</title>\n"
    if bg:
        head += f'  <rect width="{total}" height="{total}" fill="{bg}"/>\n'
    return head + f'  <path fill="{colour}" d="{"".join(parts)}"/>\n</svg>\n'


# --- verification ---------------------------------------------------------------
def _read_back(m, n, reserved, mask, count):
    """Undo the mask and read the data stream out again, in placement order."""
    bits = []
    up, col = True, n - 1
    while col > 0:
        if col == 6:
            col -= 1
        rows = range(n - 1, -1, -1) if up else range(n)
        for r in rows:
            for c in (col, col - 1):
                if not reserved[r][c]:
                    v = m[r][c]
                    if MASKS[mask](r, c):
                        v ^= 1
                    bits.append(v)
        up = not up
        col -= 2
    bits = bits[: count * 8]
    return [int("".join(str(b) for b in bits[i:i + 8]), 2) for i in range(0, len(bits), 8)]


def selftest(text):
    ok = True
    payload = text.encode("utf-8")
    version, level = choose(len(payload))
    stream, blocks, ecs = encode_codewords(payload, version, level)
    ec_len = ECC[version][level][0]

    # 1. every RS codeword must be divisible by the generator polynomial
    for b, e in zip(blocks, ecs):
        full = b + e
        g = rs_generator(ec_len)
        rem = list(full)
        for i in range(len(full) - ec_len):
            c = rem[i]
            if c:
                for j, gj in enumerate(g):
                    rem[i + j] ^= gf_mul(gj, c)
        if any(rem[len(full) - ec_len:]):
            print("FAIL: codeword not divisible by generator")
            ok = False
    print(f"  RS: {len(blocks)} blocks x {ec_len} EC codewords, all divisible by the generator")

    # 2. BCH format bits against the published value for (M, mask 0)
    if _format_bits("M", 0) != 0b101010000010010:
        print("FAIL: format bits for (M, mask 0)")
        ok = False
    for lv in "LMQH":
        for mk in range(8):
            f = _format_bits(lv, mk) ^ 0b101010000010010
            rem = f
            for i in range(4, -1, -1):
                if rem & (1 << (i + 10)):
                    rem ^= 0b10100110111 << i
            if rem:
                print(f"FAIL: BCH remainder for {lv}/{mk}")
                ok = False
    print("  format: (M,0) matches the standard value; all 32 combinations have zero BCH remainder")

    # 3. round trip -- read the finished matrix back and recover the codewords
    m, version, level, mask = make_matrix(text)
    n = len(m)
    reserved = _reserved(n, version)
    got = _read_back(m, n, reserved, mask, len(stream))
    if got != stream:
        print("FAIL: round trip differs from the encoded stream")
        ok = False
    else:
        print(f"  round trip: {len(stream)} codewords recovered from the masked matrix")

    # 4. structure
    if not (m[0][0] == m[0][6] == m[6][0] == 1 and m[1][1] == 0 and m[3][3] == 1):
        print("FAIL: finder pattern")
        ok = False
    if any(m[6][i] != 1 - (i % 2) for i in range(8, n - 8)):
        print("FAIL: timing pattern")
        ok = False
    if m[n - 8][8] != 1:
        print("FAIL: dark module")
        ok = False
    print(f"  structure: finders, timing and dark module correct; version {version}-{level}, "
          f"mask {mask}, {n}x{n}")
    print("  OK" if ok else "  FAILED")
    return ok


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    if argv[0] == "--selftest":
        return 0 if selftest(argv[1] if len(argv) > 1 else "https://raa.space/raa-ceturdienas") else 1
    url = argv[0]
    out = argv[1] if len(argv) > 1 and not argv[1].startswith("--") else "qr.svg"
    opts = {"--ecc": None, "--colour": "#070301", "--size": "40mm", "--quiet": "4",
            "--bg": None}
    for i, a in enumerate(argv):
        if a in opts and i + 1 < len(argv):
            opts[a] = argv[i + 1]
    m, version, level, mask = make_matrix(url, opts["--ecc"])
    svg = to_svg(m, colour=opts["--colour"], quiet=int(opts["--quiet"]),
                 size=opts["--size"], title=url, bg=opts["--bg"])
    open(out, "w").write(svg)
    print(f"{out}  version {version}-{level}, mask {mask}, {len(m)}x{len(m)} modules "
          f"(+{opts['--quiet']} quiet), modules {opts['--colour']}, "
          f"background {opts['--bg'] or 'transparent'}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
