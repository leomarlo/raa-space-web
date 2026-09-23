#!/usr/bin/env python3
"""Build the RAA Ceturdienas brochure: 4 A5 pages, Latvian and English.

    python3 brochure.py            -> brochure/*.svg and brochure/*.pdf
    python3 brochure.py lv         -> Latvian only

Pages: 1 cover (the opening photo), 2 about + team, 3 calendar, 4 closing
(theme.jpg).  Inside pages sit on --raa-black, set in --raa-orange with
--raa-green for secondary information; every rule, caption underline and
calendar line is a generated thread row.
"""
from PIL import Image, ImageFont
import base64, io, os, subprocess, sys, tempfile

import make_thread_row as mtr

HERE = os.path.dirname(os.path.abspath(__file__))
PICS = os.path.join(HERE, "pics")
OUT = os.path.join(HERE, "brochure")

# --- page geometry, millimetres -------------------------------------------------
PW, PH = 148.0, 210.0          # A5
M = 13.0                       # margin
CW = PW - 2 * M                # content width
RULE_H = 2.0                   # header / footer rule
THIN_H = 1.5                   # caption underlines, calendar lines

DARK = "#070301"               # --raa-black
ORANGE = "#bc6f20"             # --raa-orange
GREEN = "#c3c967"              # --raa-green

FONT = "/System/Library/Fonts/HelveticaNeue.ttc"
FAMILY = "Helvetica Neue, Helvetica, Arial, sans-serif"

COVER_PHOTO = os.path.join(PICS, "photo_5864233924194668349_y.jpg")
BACK_PHOTO = os.path.join(PICS, "theme.jpg")

# Thursdays from 1 October to mid December 2026, with the programme as given.
# `title` None = the slot is still open.  `avail` is what space is still free on
# that date, which is what a would-be participant needs to know.
SCHEDULE = [
    ("october", 1, {"en": "Work day stories", "lv": "Darba dienas stāsti"},
     {"en": "Entrance area · limited", "lv": "Ieejas zona · ierobežoti"}),
    ("october", 8, {"en": "Elīna Vedija Rībena", "lv": "Elīna Vedija Rībena"},
     {"en": "Entrance area · limited", "lv": "Ieejas zona · ierobežoti"}),
    ("october", 15, {"en": "Rehearsals for “God Abandons Johan’s”",
                     "lv": "Mēģinājumi izrādei “God Abandons Johan’s”"},
     {"en": "Anywhere · tentative, confirmation pending",
      "lv": "Jebkur · provizoriski, gaida apstiprinājumu"}),
    ("october", 22, {"en": "Aleksandrs Barons — poetry, drama, music",
                     "lv": "Aleksandrs Barons — dzeja, drāma, mūzika"},
     {"en": "Anywhere · event scheduled", "lv": "Jebkur · pasākums ieplānots"}),
    ("october", 29, {"en": "Book presentation", "lv": "Grāmatas prezentācija"},
     {"en": "No space free · booked", "lv": "Nav brīvas vietas · aizņemts"}),
    ("november", 5, {"en": "Erotic Poetry performance / Shaddow Theatre",
                     "lv": "Erotiskās dzejas performance / Shaddow Theatre"},
     {"en": "Free · event scheduled", "lv": "Brīvs · pasākums ieplānots"}),
    ("november", 12, {"en": "Baroque Dance — Stella / Barroque-themed evening",
                      "lv": "Baroka deja — Stella / Barroque tematisks vakars"},
     {"en": "Free · event scheduled", "lv": "Brīvs · pasākums ieplānots"}),
    ("november", 19, {"en": "Confession Booth? Being in a cult performance?",
                      "lv": "Grēksūdzes būda? Performance par dzīvi kultā?"},
     {"en": "Theatre room only · limited", "lv": "Tikai teātra zāle · ierobežoti"}),
    ("november", 26, {"en": "Possible performance — “God Abandons Johan’s”",
                      "lv": "Iespējama performance — “God Abandons Johan’s”"},
     {"en": "Theatre room only · tentative, confirmation pending",
      "lv": "Tikai teātra zāle · provizoriski, gaida apstiprinājumu"}),
    ("december", 3, {"en": "Monoplay — Borderline? Fleebag? 45 min",
                     "lv": "Monoizrāde — Borderline? Fleebag? 45 min"},
     {"en": "Theatre room · limited", "lv": "Teātra zāle · ierobežoti"}),
    ("december", 10, None,
     {"en": "Theatre room · limited, open for proposals",
      "lv": "Teātra zāle · ierobežoti, gaidām pieteikumus"}),
    ("december", 17, None,
     {"en": "Theatre room · limited, open for proposals",
      "lv": "Teātra zāle · ierobežoti, gaidām pieteikumus"}),
]

TEXT = {
    "lv": {
        "title1": "RAA", "title2": "CETURDIENAS",
        "cover": "Mazas teātra miniatūras, performances un\ndzejas performances 2026. gada rudenī",
        "about_h": "PAR CIKLU",
        "about": (
            "Katru ceturtdienu RAA kļūst par skatuvi īsiem priekšnesumiem, skatuves "
            "eksperimentiem, idejām, miniatūrām, balss vai lasījuma performancēm un cita "
            "veida uzvedumiem. Tiem nav jābūt pilnībā iestudētiem darbiem, taču tie nav arī "
            "improvizēti atvērtie mikrofoni. Tās ir ideju skices — dažas ar dramaturģiju, citas "
            "mazāk. Var būt grupas, var būt individuāli, var būt arī ne-cilvēki. Programma tiek "
            "slēgta 10 dienas pirms pasākuma. Ja vēlies piedalīties, atsūti mums savas idejas "
            "aprakstu un datumu, kurā vēlies uzstāties."),
        "team_h": "KOMANDA",
        "team": [("Leonhard Horstmeyer", "telpas veidotājs"),
                 ("Jana Zarina", "mākslinieciskā vadītāja"),
                 ("Elvita Rakštīte", "RAA Ceturdienu kuratore")],
        "cal_h": "KALENDĀRS",
        "months": {"october": "Oktobris", "november": "Novembris", "december": "Decembris"},
        "cal_note": "Programma tiek slēgta 10 dienas pirms katra pasākuma.",
        "back": "RAA Ceturdienas · 2026. gada rudenī",
        "foot": "RAA Ceturdienas",
    },
    "en": {
        "title1": "RAA", "title2": "CETURDIENAS",
        "cover": "Small theatre miniatures, performances &\npoetry performances in the fall of 2026",
        "about_h": "ABOUT",
        "about": (
            "Every Thursday RAA becomes a stage for short performances, stage experiments, "
            "ideas, miniatures, voice or reading performances, other kinds of acts. These "
            "don't have to be fully produced pieces, but they should also not be impromptu "
            "open-mics. Instead these are sketches of ideas, some with a dramaturgy, others "
            "less so. Can be groups, can be individual, can be non-human. The program is "
            "finalized 10 days before the event. If you want to participate, send us an "
            "outline of your idea and the date where you would like to be placed."),
        "team_h": "TEAM",
        "team": [("Leonhard Horstmeyer", "space maker"),
                 ("Jana Zarina", "artistic director"),
                 ("Elvita Rakštīte", "curator of the RAA Ceturdienas")],
        "cal_h": "CALENDAR",
        "months": {"october": "October", "november": "November", "december": "December"},
        "cal_note": "The program is finalized 10 days before each event.",
        "back": "RAA Ceturdienas · fall 2026",
        "foot": "RAA Ceturdienas",
    },
}

_rules = {}
_tmp = None


def _font(size_px, bold=False):
    return ImageFont.truetype(FONT, size_px, index=1 if bold else 0)


def _text_mm(s, size_mm, bold=False):
    """Width of a string in mm when set at size_mm."""
    f = _font(200, bold)
    return f.getlength(s) / 200.0 * size_mm


def _fit(s, target_mm, bold=False, cap=40.0):
    """Largest size (mm) at which s fits target_mm."""
    return min(cap, target_mm / (_text_mm(s, 1.0, bold) or 1.0))


def _wrap(s, size_mm, max_mm, bold=False):
    out, line = [], ""
    for word in s.split():
        trial = word if not line else line + " " + word
        if _text_mm(trial, size_mm, bold) <= max_mm:
            line = trial
        else:
            out.append(line)
            line = word
    if line:
        out.append(line)
    return out


def _uri(data, mime):
    return f"data:{mime};base64," + base64.b64encode(data).decode("ascii")


def _photo_uri(path, box_w, box_h):
    """Centre-crop a photo to the box aspect and embed it at native resolution."""
    im = Image.open(path).convert("RGB")
    want = box_w / box_h
    have = im.width / im.height
    if have > want:
        w = int(round(im.height * want))
        im = im.crop(((im.width - w) // 2, 0, (im.width - w) // 2 + w, im.height))
    else:
        h = int(round(im.width / want))
        im = im.crop((0, (im.height - h) // 2, im.width, (im.height - h) // 2 + h))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=92)
    dpi = im.width / box_w * 25.4
    return _uri(buf.getvalue(), "image/jpeg"), dpi


def _rule_uri(width_mm, height_mm):
    """A thread row proportioned for a rule of this size."""
    beats = max(2, int(round(width_mm / height_mm * (74.0 / 70.0))))
    if beats not in _rules:
        global _tmp
        if _tmp is None:
            _tmp = tempfile.mkdtemp(prefix="raa-rules-")
        path = os.path.join(_tmp, f"rule-{beats}.png")
        mtr.generate_row(beats, path)
        _rules[beats] = _uri(open(path, "rb").read(), "image/png")
    return _rules[beats]


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def band(y, h=RULE_H):
    """A header/footer rule, bled to both page edges."""
    return rule(0.0, y, PW, h)


def rule(x, y, w, h=RULE_H):
    return (f'<image x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'preserveAspectRatio="none" href="{_rule_uri(w, h)}"/>')


def txt(x, y, s, size, fill=ORANGE, weight="normal", anchor="start", spacing=None):
    ls = f' letter-spacing="{spacing}"' if spacing else ""
    return (f'<text x="{x:.2f}" y="{y:.2f}" font-family="{FAMILY}" font-size="{size:.2f}" '
            f'fill="{fill}" font-weight="{weight}" text-anchor="{anchor}"{ls}>{esc(s)}</text>')


def _page(body, defs=""):
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{PW}mm" height="{PH}mm" viewBox="0 0 {PW} {PH}">\n'
            f'{defs}<rect width="{PW}" height="{PH}" fill="{DARK}"/>\n{body}\n</svg>\n')


def _footer(t, page_no):
    """Inside pages only -- the cover and closing carry no header or footer."""
    b = [band(PH - M - RULE_H)]
    b.append(txt(M, PH - M + 3.4, t["foot"], 2.6, GREEN))
    if page_no:
        b.append(txt(PW - M, PH - M + 3.4, str(page_no), 2.6, GREEN, anchor="end"))
    return b


def _caption(y, s, t=None):
    """Heading with a thread-row underline the width of the words."""
    size = 5.0
    w = _text_mm(s, size, bold=True) + 2.0
    return [txt(M, y, s, size, ORANGE, weight="bold", spacing="0.6"),
            rule(M, y + 1.6, min(w, CW), THIN_H)]


def page_cover(t):
    uri, dpi = _photo_uri(COVER_PHOTO, PW, PH)
    b = [f'<image x="0" y="0" width="{PW}" height="{PH}" preserveAspectRatio="none" href="{uri}"/>',
         # scrims so the type holds on the photograph
         f'<rect x="0" y="0" width="{PW}" height="78" fill="url(#top)"/>',
         f'<rect x="0" y="{PH-72}" width="{PW}" height="72" fill="url(#bot)"/>']
    s2 = _fit(t["title2"], CW, bold=True)
    b.append(txt(M, 40, t["title1"], s2 * 1.02, ORANGE, weight="bold", spacing="1.5"))
    b.append(txt(M, 40 + s2 * 1.12, t["title2"], s2, ORANGE, weight="bold", spacing="0.4"))
    y = PH - M - 4
    for line in reversed(t["cover"].split("\n")):
        b.append(txt(M, y, line, 3.5, GREEN))
        y -= 5.2
    defs = (f'<defs>'
            f'<linearGradient id="top" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{DARK}" stop-opacity="0.92"/>'
            f'<stop offset="1" stop-color="{DARK}" stop-opacity="0"/></linearGradient>'
            f'<linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{DARK}" stop-opacity="0"/>'
            f'<stop offset="1" stop-color="{DARK}" stop-opacity="0.94"/></linearGradient>'
            f'</defs>\n')
    return _page("\n".join(b), defs)


def page_about(t):
    b = [band(M)]
    b += _caption(M + 14, t["about_h"])
    y = M + 26
    size = 3.15
    for line in _wrap(t["about"], size, CW):
        b.append(txt(M, y, line, size, ORANGE))
        y += 4.9
    y += 12
    b += _caption(y, t["team_h"])
    y += 12
    for name, role in t["team"]:
        b.append(txt(M, y, name, 3.6, ORANGE))
        b.append(txt(M, y + 4.6, role, 3.0, GREEN))
        y += 12.5
    b += _footer(t, 2)
    return _page("\n".join(b))


def page_calendar(t, lang):
    b = [band(M)]
    b += _caption(M + 14, t["cal_h"])
    y = M + 27
    num_w = 10.5
    month = None
    for key, day, title, avail in SCHEDULE:
        if key != month:
            month = key
            y += 1.5
            b.append(txt(M, y, t["months"][key], 3.0, GREEN, spacing="0.9"))
            y += 5.6
        b.append(txt(M, y, f"{day:02d}", 3.8, ORANGE))
        if title:
            b.append(txt(M + num_w, y, title[lang], 3.0, ORANGE))
            b.append(txt(M + num_w, y + 3.7, avail[lang], 2.4, GREEN))
        else:
            b.append(txt(M + num_w, y + 1.8, avail[lang], 2.4, GREEN))
        b.append(rule(M, y + 5.4, CW, THIN_H))
        y += 10.1
    b.append(txt(M, PH - M - RULE_H - 5.5, t["cal_note"], 2.7, GREEN))
    b += _footer(t, 3)
    if y > PH - M - RULE_H - 10:
        print(f"    ! calendar runs to y={y:.1f}mm, footer starts at {PH-M-RULE_H:.1f}mm")
    return _page("\n".join(b))


def page_back(t):
    """Closing page: mirrors the cover, full bleed, so the two photographs bookend."""
    uri, dpi = _photo_uri(BACK_PHOTO, PW, PH)
    b = [f'<image x="0" y="0" width="{PW}" height="{PH}" preserveAspectRatio="none" href="{uri}"/>',
         f'<rect x="0" y="0" width="{PW}" height="52" fill="url(#top)"/>',
         f'<rect x="0" y="{PH-84}" width="{PW}" height="84" fill="url(#bot)"/>']
    y = PH - M - 17
    b.append(txt(M, y, t["title1"] + " " + t["title2"], 6.4, ORANGE, weight="bold", spacing="0.5"))
    b.append(rule(M, y + 2.4, CW, THIN_H))
    b.append(txt(M, y + 10.5, t["back"], 3.0, GREEN))
    defs = (f'<defs>'
            f'<linearGradient id="top" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{DARK}" stop-opacity="0.9"/>'
            f'<stop offset="1" stop-color="{DARK}" stop-opacity="0"/></linearGradient>'
            f'<linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{DARK}" stop-opacity="0"/>'
            f'<stop offset="1" stop-color="{DARK}" stop-opacity="0.95"/></linearGradient>'
            f'</defs>\n')
    return _page("\n".join(b), defs)


def build(lang):
    t = TEXT[lang]
    os.makedirs(OUT, exist_ok=True)
    pages = [("1-cover", page_cover(t)), ("2-about", page_about(t)),
             ("3-calendar", page_calendar(t, lang)), ("4-closing", page_back(t))]
    svgs = []
    for name, svg in pages:
        p = os.path.join(OUT, f"raa-ceturdienas-{lang}-{name}.svg")
        open(p, "w").write(svg)
        svgs.append(p)
        print("  " + os.path.relpath(p, HERE))
    pdfs = []
    for p in svgs:
        q = p[:-4] + ".pdf"
        subprocess.run(["inkscape", p, "--export-type=pdf", "--export-text-to-path", "-o", q],
                       check=True, capture_output=True)
        pdfs.append(q)
    merged = os.path.join(OUT, f"raa-ceturdienas-{lang}.pdf")
    subprocess.run(["gs", "-dBATCH", "-dNOPAUSE", "-q", "-sDEVICE=pdfwrite",
                    "-dPDFSETTINGS=/prepress", f"-sOutputFile={merged}"] + pdfs, check=True)
    for q in pdfs:
        os.remove(q)
    print("  " + os.path.relpath(merged, HERE))
    return merged


if __name__ == "__main__":
    langs = sys.argv[1:] or ["lv", "en"]
    for lang in langs:
        print(f"{lang}:")
        build(lang)
