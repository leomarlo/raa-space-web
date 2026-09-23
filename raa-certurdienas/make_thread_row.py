#!/usr/bin/env python3
"""Generate horizontal rows of sequin "beats" harvested from pics/theme.jpg.

The cloth in the photo never offers more than ~7 clean beats in a row before a
fold or shadow interrupts it, so a repeating cycle is assembled out of the best
short runs found across the whole image.  Each beat is cut trough-to-trough and
resampled to a uniform width, which makes the cycle tile exactly.

    python3 make_thread_row.py 40                  -> pics/theme-row-40.png
    python3 make_thread_row.py 40 out.png --scale 2

    from make_thread_row import generate_row
    generate_row(40, "out.png")

First run harvests the beats from the photo (~1 min) and caches them in
pics/theme-beats-cycle.png; later runs reuse the cache.
"""
from PIL import Image
import json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "pics", "theme.jpg")
CACHE = os.path.join(HERE, "pics", "theme-beats-cycle.png")
CACHE_META = os.path.join(HERE, "pics", "theme-beats-cycle.json")

ROW_PERIOD = 18.5      # px between rows in the photo
BEAT_PERIOD = 17.5     # px between beats along a row
SS = 4                 # supersampling of the harvest
BEAT_W = int(BEAT_PERIOD * SS)
THEME_DARK = (7, 3, 1)  # --raa-black

# Which beats to keep, by the hue of their bright core:
#   (15, 50)  amber / orange  -- the default
#   (50, 95)  the pale green and sage beats
HUE_KEEP = (15.0, 50.0)
SAT_MIN = 48.0          # below this the beat is a washed-out tan, not amber
MIN_CONTRAST = 18.0     # core minus edge; less than this reads as an empty gap
CORE_MIN = 60.0         # the cloth's amber beats run 35..109; the dim end reads as a gap

# Row segments worth harvesting: (name, centre x, centre y, angle deg, half-length px).
# Found by scanning the photo for local row angle, then scoring every beat for
# sharpness, chroma and core-vs-edge contrast.  These are the amber/orange
# clusters, all in the right-middle of the frame where the cloth catches warm
# light; the pale-green runs in the lower left are sharper but the wrong colour.
SEGMENTS = [
    ("A1", 627.9, 393.3, 17.0, 75),    # densest amber cluster
    ("A2", 596.2, 468.8, 16.0, 75),
    ("A3", 671.5, 63.8, 17.0, 60),     # top edge, deep orange
    ("A4", 600.5, 308.5, 14.0, 75),
    ("A5", 844.6, 463.7, 18.0, 55),
    ("A6", 495.8, 387.1, 16.0, 60),
    ("row3", 764.2, 137.6, 17.5, 55),  # the amber stretch of the third row
]


def _lum(p):
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]


def _straighten(img, gl, cx, cy, deg, half):
    """Resample one row segment into a horizontal strip, tracking its centre."""
    W, H = img.size
    rp = img.load()
    a = math.radians(deg)
    ux, uy = math.cos(a), -math.sin(a)
    vx, vy = math.sin(a), math.cos(a)

    def L(x, y):
        x = min(max(x, 0), W - 2); y = min(max(y, 0), H - 2)
        x0, y0 = int(x), int(y); fx, fy = x - x0, y - y0
        return ((gl[x0, y0] * (1 - fx) + gl[x0 + 1, y0] * fx) * (1 - fy)
                + (gl[x0, y0 + 1] * (1 - fx) + gl[x0 + 1, y0 + 1] * fx) * fy)

    def C(x, y):
        x = min(max(x, 0), W - 2); y = min(max(y, 0), H - 2)
        x0, y0 = int(x), int(y); fx, fy = x - x0, y - y0
        return tuple((rp[x0, y0][c] * (1 - fx) + rp[x0 + 1, y0][c] * fx) * (1 - fy)
                     + (rp[x0, y0 + 1][c] * (1 - fx) + rp[x0 + 1, y0 + 1][c] * fx) * fy
                     for c in range(3))

    # perpendicular brightness centroid along the segment, then smooth it
    obs = []
    for p in range(-half - 30, half + 31, 2):
        col = []
        for i in range(-int(ROW_PERIOD), int(ROW_PERIOD) + 1):
            dt = i / 2
            vals = [L(cx + (p + s) * ux + dt * vx, cy + (p + s) * uy + dt * vy) for s in (-3, 0, 3)]
            col.append((dt, sum(vals) / len(vals)))
        lo = min(v for _, v in col)
        wts = [(dt, max(0.0, v - lo)) for dt, v in col]
        tot = sum(w for _, w in wts)
        if tot > 0:
            obs.append((p, sum(dt * w for dt, w in wts) / tot, max(v for _, v in col) - lo))
    sigma = 40.0

    def centre(p):
        num = den = 0.0
        for q, c, w in obs:
            k = math.exp(-((p - q) ** 2) / (2 * sigma * sigma)) * w
            num += k * c; den += k
        return num / den if den else 0.0

    track = {p: centre(p) for p in range(-half, half + 1)}
    Wp, Hp = 2 * half * SS, int(round(ROW_PERIOD * SS))
    out = Image.new("RGB", (Wp, Hp))
    op = out.load()
    for i in range(Wp):
        p = -half + i / SS
        c = track[int(round(p))]
        for k in range(Hp):
            dt = c - ROW_PERIOD / 2 + k / SS
            op[i, k] = tuple(int(round(v)) for v in C(cx + p * ux + dt * vx, cy + p * uy + dt * vy))
    return out


def _split_beats(strip):
    """Cut a straightened strip into beats (trough to trough), each resampled to BEAT_W."""
    W, H = strip.size
    gl = strip.convert("L").load()
    y0, y1 = int(H * 0.2), int(H * 0.8)
    col = [sum(gl[x, y] for y in range(y0, y1)) / (y1 - y0) for x in range(W)]
    win = BEAT_W
    det = []
    for i in range(W):
        a, b = max(0, i - win // 2), min(W, i + win // 2 + 1)
        det.append(col[i] - sum(col[a:b]) / (b - a))
    peaks = []
    for i in range(1, W - 1):
        if det[i] > det[i - 1] and det[i] >= det[i + 1] and det[i] > 1.0:
            if not peaks or i - peaks[-1] >= 0.6 * BEAT_W:
                peaks.append(i)
            elif det[i] > det[peaks[-1]]:
                peaks[-1] = i
    troughs = [min(range(a, b), key=lambda i: col[i]) for a, b in zip(peaks, peaks[1:])]
    beats = []
    for t0, t1 in zip(troughs, troughs[1:]):
        if not (0.5 * BEAT_W <= t1 - t0 <= 2.2 * BEAT_W):
            continue
        beats.append(strip.crop((t0, 0, t1, H)).resize((BEAT_W, H), Image.LANCZOS))
    return beats


def _quality(tile):
    """Core-vs-edge contrast, peak and hue -- rejects dark gaps and blown highlights."""
    W, H = tile.size
    gl = tile.convert("L").load()
    rp = tile.load()
    y0, y1 = int(H * 0.2), int(H * 0.8)
    core = [gl[x, y] for x in range(int(W * 0.3), int(W * 0.7)) for y in range(y0, y1)]
    edge = [gl[x, y] for x in list(range(0, int(W * 0.15))) + list(range(int(W * 0.85), W))
            for y in range(y0, y1)]
    cpx = [rp[x, y] for x in range(int(W * 0.3), int(W * 0.7)) for y in range(y0, y1)]
    top = sorted(cpx, key=lambda q: -_lum(q))[: max(1, len(cpx) // 5)]
    colour = tuple(sum(q[c] for q in top) / len(top) for c in range(3))
    mx, mn = max(colour), min(colour)
    hue = 0.0
    if mx > mn:
        r, g, b = colour
        if mx == r:
            hue = (60 * ((g - b) / (mx - mn))) % 360
        elif mx == g:
            hue = 60 * ((b - r) / (mx - mn)) + 120
        else:
            hue = 60 * ((r - g) / (mx - mn)) + 240
    sat = 0.0 if mx == 0 else (mx - mn) / mx * 100
    return dict(core=sum(core) / len(core), edge=sum(edge) / len(edge),
                peak=max(core), hue=hue, sat=sat, colour=colour)


def build_cycle(length=20, rebuild=False):
    """Harvest the beats and order them into a cycle that tiles seamlessly."""
    if not rebuild and os.path.exists(CACHE):
        return Image.open(CACHE).convert("RGB")
    img = Image.open(SRC).convert("RGB")
    gl = img.convert("L").load()
    bank = []
    for name, cx, cy, deg, half in SEGMENTS:
        strip = _straighten(img, gl, cx, cy, deg, half)
        for i, tile in enumerate(_split_beats(strip)):
            q = _quality(tile)
            if (q["core"] - q["edge"] >= MIN_CONTRAST and q["peak"] > 70
                    and q["core"] >= CORE_MIN and q["core"] > q["edge"] * 1.15
                    and HUE_KEEP[0] <= q["hue"] <= HUE_KEEP[1]
                    and q["sat"] >= SAT_MIN):
                bank.append((f"{name}{i}", tile, q))
    if not bank:
        raise RuntimeError("no usable beats harvested")
    # best-contrasted first; if there are more than the cycle needs, drop the rest
    bank.sort(key=lambda t: -(t[2]["core"] - t[2]["edge"]))
    bank = bank[:length]
    # If the cloth yielded fewer good beats than asked for, shorten the cycle to
    # match rather than restarting it mid-cycle: the period is then exact and the
    # only join that repeats is the wrap seam, which gets blended.
    length = len(bank)
    # level-match: lift every beat's gap level to the bank median so joins don't step
    floors = sorted(q["edge"] for _, _, q in bank)
    target = floors[len(floors) // 2]
    fixed = []
    for name, tile, q in bank:
        off = target - q["edge"]
        if abs(off) > 1:
            tile = tile.point(lambda v, o=off: max(0, min(255, int(v + o))))
        fixed.append((name, tile, q))
    # Order by similarity rather than a strict ramp: start at the deepest beat and
    # repeatedly take the nearest unused one in (hue, brightness), so neighbours
    # match and the wrap-around seam has no step in it.
    def dist(a, b):
        return ((a[2]["hue"] - b[2]["hue"]) / 8.0) ** 2 + ((a[2]["core"] - b[2]["core"]) / 14.0) ** 2

    pool = sorted(fixed, key=lambda t: t[2]["core"])
    chain = [pool.pop(0)]
    while pool:
        nxt = min(pool, key=lambda c: dist(chain[-1], c))
        pool.remove(nxt)
        chain.append(nxt)
    order = (chain * (length // len(chain) + 1))[:length]
    cyc = Image.new("RGB", (BEAT_W * length, chain[0][1].height))
    for i, (_, tile, _) in enumerate(order):
        cyc.paste(tile, (i * BEAT_W, 0))
    _blend_seams(cyc, BEAT_W, wrap=True)
    cyc.save(CACHE)
    json.dump(dict(beats=length, beat_w=BEAT_W, height=cyc.height, ss=SS,
                   unique=len(fixed), names=[n for n, _, _ in order]),
              open(CACHE_META, "w"), indent=1)
    return cyc


def _blend_seams(img, period, width=8, wrap=False):
    """Symmetrically cross-fade the columns either side of each tile join."""
    W, H = img.size
    px = img.load()
    seams = list(range(period, W, period))
    if wrap:
        seams.append(0)
    for x0 in seams:
        for j in range(width):
            a = (x0 - 1 - j) % W
            b = (x0 + j) % W
            alpha = 0.5 * (1 - j / width)
            for y in range(H):
                pa, pb = px[a, y], px[b, y]
                px[a, y] = tuple(int(round(pa[c] * (1 - alpha) + pb[c] * alpha)) for c in range(3))
                px[b, y] = tuple(int(round(pb[c] * (1 - alpha) + pa[c] * alpha)) for c in range(3))


def generate_row(beats, out=None, scale=1.0, height=None, fade=0.22, knee=58,
                 dark=THEME_DARK, cycle=None):
    """Write a horizontal row of `beats` beats.

    scale  : 1.0 keeps the harvest resolution (70 px per beat)
    height : output height in px (default: proportional to scale)
    fade   : fraction of the height at top and bottom faded into `dark`
    knee   : luminance below which pixels are pulled toward `dark` (0 disables)
    dark   : the theme's near-black, used for gaps and the outer edges
    """
    if beats < 1:
        raise ValueError("beats must be >= 1")
    cyc = cycle if cycle is not None else build_cycle()
    n_cycle = cyc.width // BEAT_W
    strip = Image.new("RGB", (BEAT_W * beats, cyc.height))
    for i in range(beats):
        src = cyc.crop(((i % n_cycle) * BEAT_W, 0, (i % n_cycle + 1) * BEAT_W, cyc.height))
        strip.paste(src, (i * BEAT_W, 0))
    _blend_seams(strip, BEAT_W)

    W, H = strip.size
    px = strip.load()
    for y in range(H):
        e = min(y, H - 1 - y) / H
        vfade = 0.0 if fade <= 0 or e >= fade else ((fade - e) / fade) ** 1.2
        for x in range(W):
            p = px[x, y]
            if knee > 0:
                L = _lum(p)
                if L < knee:
                    t = ((knee - L) / knee) ** 1.5
                    p = tuple(p[c] * (1 - t) + dark[c] * t for c in range(3))
            if vfade > 0:
                p = tuple(p[c] * (1 - vfade) + dark[c] * vfade for c in range(3))
            px[x, y] = tuple(int(round(v)) for v in p)

    if height is not None:
        scale = height / H
    if abs(scale - 1.0) > 1e-9:
        strip = strip.resize((max(1, int(round(W * scale))), max(1, int(round(H * scale)))),
                             Image.LANCZOS)
    if out is None:
        out = os.path.join(HERE, "pics", f"theme-row-{beats}.png")
    strip.save(out)
    return out, strip.size


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    beats = int(argv[0])
    out = argv[1] if len(argv) > 1 and not argv[1].startswith("--") else None
    kw = {}
    for i, a in enumerate(argv):
        if a == "--scale":
            kw["scale"] = float(argv[i + 1])
        elif a == "--height":
            kw["height"] = int(argv[i + 1])
        elif a == "--fade":
            kw["fade"] = float(argv[i + 1])
        elif a == "--no-dark-map":
            kw["knee"] = 0
        elif a == "--rebuild":
            build_cycle(rebuild=True)
    path, size = generate_row(beats, out, **kw)
    print(f"{path}  {size[0]}x{size[1]}  ({beats} beats)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
