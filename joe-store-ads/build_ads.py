"""jö store ads (Store 1 = PAGRO, Store 2 = BIPA): places brand-compliant ads into the red areas of the store vector files.

Run:  python3 build_ads.py
Out:  Store1-ads.svg, Store2-ads.svg (same canvas / viewBox as the source vectors)

Brand rules (jö Brand Guide / Motion Guideline):
- Colours: Burgund #5B0F0C, Rot #E8371A, Orange #F9781E, Hellorange #FFB37C,
  Flieder #EBE8EE, Beige #F4F1EA, Weiss; jö-Verlauf Burgund -> Rot -> Orange
- Satoshi for everything; headlines bold and tight; one word may be highlighted
- Die Kachel: a jö-Verlauf surface that is always cropped, enters from the bottom
  (portrait) or the side (landscape) at 25/50/75 %, only inner corners rounded,
  radius = 14 % of the short side
- Logo: Burgund on light, white on Burgund or on the Verlauf
- Banner: headline on the surface, photo as panel, pill button as closing element
"""
import base64, io, json, os, re
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
IMG = os.path.join(HERE, "..", "joe-strategiefilm", "v3")

WINE, RED, ORANGE, LORANGE = "#5B0F0C", "#E8371A", "#F9781E", "#FFB37C"
LILAC, BEIGE, WHITE = "#EBE8EE", "#F4F1EA", "#FFFFFF"

LP = json.load(open(os.path.join(SRC, "logo_paths.json")))
LOGO_W, LOGO_H = 271.15, 182.86

FONT_B64 = base64.b64encode(open(os.path.join(HERE, "..", "joe-strategiefilm", "assets", "satoshi.woff2"), "rb").read()).decode()


def img_data(path, max_w=2400, fmt="JPEG"):
    im = Image.open(os.path.join(IMG, path))
    im = im.convert("RGBA" if fmt == "PNG" else "RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, fmt, quality=90) if fmt == "JPEG" else im.save(b, fmt, optimize=True)
    mime = "image/jpeg" if fmt == "JPEG" else "image/png"
    return f"data:{mime};base64," + base64.b64encode(b.getvalue()).decode(), im.size


_uid = [0]


def uid(p):
    _uid[0] += 1
    return f"{p}{_uid[0]}"


def gradient(w, h):
    """jö-Verlauf (radial from bottom-left, as in the Brand Guide CSS token --jg)."""
    gid = uid("jg")
    cx, cy = -0.184 * w, 1.236 * h
    rx, ry = 1.286 * w, 1.911 * h
    stops = [(0, "#5c3048"), (2, "#663047"), (8, "#8c3044"), (14, "#a83041"), (20, "#b93040"),
             (24, "#c02031"), (55, "#ef2700"), (74, "#f23e10"), (90, "#fb6321"), (96, "#ff7024")]
    st = "".join(f'<stop offset="{o}%" stop-color="{c}"/>' for o, c in stops)
    d = (f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" '
         f'gradientTransform="translate({cx:.1f} {cy:.1f}) scale({rx:.1f} {ry:.1f})">{st}</radialGradient>')
    return gid, d


def logo(x, y, w, color):
    """Static jö logo (original paths from the brand film), top-left at x,y with width w."""
    s = w / LOGO_W
    m = uid("lm")
    return (f'<g transform="translate({x:.1f} {y:.1f}) scale({s:.5f})" fill="{color}">'
            f'<defs><mask id="{m}" maskUnits="userSpaceOnUse" x="-20" y="-80" width="320" height="290">'
            f'<rect x="-20" y="-80" width="320" height="290" fill="#fff"/><path d="{LP["CUT"]}" fill="#000"/>'
            f'<path d="{LP["E"]}" fill="#fff"/></mask></defs>'
            f'<path d="{LP["J"]}"/>'
            f'<path d="{LP["RC2"]}" fill="none" stroke="{color}" stroke-width="22.79" mask="url(#{m})"/>'
            f'<path d="{LP["E"]}"/>'
            f'<circle cx="87.99" cy="16.8" r="16.8"/><circle cx="152.94" cy="16.8" r="16.8"/>'
            f'<circle cx="207.17" cy="16.8" r="16.8"/></g>')


def text(x, y, lines, size, color, weight=800, anchor="start", lh=1.04, ls=-0.02, hl=None):
    """Multi-line text. hl = (line_index, word) to highlight one word in Orange/Hellorange."""
    out = [f'<text x="{x:.1f}" y="{y:.1f}" font-family="Satoshi" font-weight="{weight}" '
           f'font-size="{size:.1f}" letter-spacing="{ls * size:.2f}" fill="{color}" text-anchor="{anchor}">']
    for i, ln in enumerate(lines):
        dy = 0 if i == 0 else size * lh
        if hl and hl[0] == i and hl[1] in ln:
            a, b = ln.split(hl[1], 1)
            ln = f'{a}<tspan fill="{hl[2]}">{hl[1]}</tspan>{b}'
        out.append(f'<tspan x="{x:.1f}" dy="{dy:.1f}">{ln}</tspan>')
    out.append("</text>")
    return "".join(out)


def pill(x, y, label, size, bg, fg, w=None, anchor="start"):
    """Pill button. Width estimated from Satoshi bold average advance (~0.56 em)."""
    h = size * 2.3
    tw = w or len(label) * size * 0.56 + size * 2.2
    if anchor == "middle":
        x -= tw / 2
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{tw:.1f}" height="{h:.1f}" rx="{h / 2:.1f}" fill="{bg}"/>'
            f'<text x="{x + tw / 2:.1f}" y="{y + h / 2 + size * 0.36:.1f}" font-family="Satoshi" font-weight="800" '
            f'font-size="{size:.1f}" fill="{fg}" text-anchor="middle">{label}</text>'), tw, h


def kachel_path(x, y, w, h, r, side):
    """Rounded only on the inner corners. side = which canvas edge it enters from."""
    if side == "bottom":   # round top-left + top-right
        return (f"M{x} {y + h} L{x} {y + r} Q{x} {y} {x + r} {y} L{x + w - r} {y} "
                f"Q{x + w} {y} {x + w} {y + r} L{x + w} {y + h} Z")
    if side == "right":    # round top-left + bottom-left
        return (f"M{x + w} {y} L{x + r} {y} Q{x} {y} {x} {y + r} L{x} {y + h - r} "
                f"Q{x} {y + h} {x + r} {y + h} L{x + w} {y + h} Z")
    if side == "left":     # round top-right + bottom-right
        return (f"M{x} {y} L{x + w - r} {y} Q{x + w} {y} {x + w} {y + r} L{x + w} {y + h - r} "
                f"Q{x + w} {y + h} {x + w - r} {y + h} L{x} {y + h} Z")


def photo(href, size, x, y, w, h, focus=(0.5, 0.5)):
    """Cover-fit an image into the box, keeping the focus point visible."""
    iw, ih = size
    s = max(w / iw, h / ih)
    dw, dh = iw * s, ih * s
    ox = x + min(0, max(w - dw, w / 2 - dw * focus[0]))
    oy = y + min(0, max(h - dh, h / 2 - dh * focus[1]))
    c = uid("pc")
    return (f'<clipPath id="{c}"><rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}"/></clipPath>'
            f'<image href="{href}" x="{ox:.1f}" y="{oy:.1f}" width="{dw:.1f}" height="{dh:.1f}" '
            f'preserveAspectRatio="none" clip-path="url(#{c})"/>')


# ---------------------------------------------------------------- photos + partner assets
# Offers and assets come from the jö partner film (joe-strategiefilm/v3/wall_comp.js, partner_logos/).
P_STATIONERY = img_data("wall_img/web/pagro.webp")        # PAGRO stationery flat lay (red)
P_PENCILS = img_data("wall_img/stifte.webp")              # colour pencil fan
P_BUBBLE = img_data("angebot_bild.webp")                  # BIPA offer photo (bubble gum)
P_BONUSBOX = img_data("wall_img/bipa_bonusbox.png", 1834, "PNG")  # BIPA Bonusbox cut-out
P_CUTOUT = img_data("ooh/ubahn_frau.webp", 1200, "PNG")   # cut-out, walking with phone
PAGRO_RED, BIPA_PINK = "#E2001A", "#E5097F"


def partner_circle(path, color, size=1600):
    """Partner circle logo re-coloured for co-branding: white circle, wordmark in partner colour."""
    im = Image.open(os.path.join(IMG, path)).convert("RGBA").resize((size, size), Image.LANCZOS)
    r, g, b_, a = im.split()
    lum = Image.merge("RGB", (r, g, b_)).convert("L")
    text_mask = lum.point(lambda v: max(0, min(255, (v - 110) * 2)))   # bright = wordmark
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    col = Image.new("RGBA", im.size, color)
    out = Image.composite(col, white, text_mask)
    out.putalpha(a)
    buf = io.BytesIO(); out.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode(), out.size


PARTNERS = {
    "pagro": (partner_circle("partner_logos/pagro.webp", PAGRO_RED), PAGRO_RED),
    "bipa": (partner_circle("partner_logos/bipa.webp", BIPA_PINK), BIPA_PINK),
}


def bbox_png(data):
    """Crop transparent margins of a PNG data URI (cut-outs) -> (href, size)."""
    raw = base64.b64decode(data[0].split(",", 1)[1])
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    a = im.getchannel("A").point(lambda v: 0 if v < 200 else v)   # drop the soft shadow plate
    im.putalpha(a)
    im = im.crop(a.getbbox())
    b = io.BytesIO(); im.save(b, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode(), im.size


P_BONUSBOX = bbox_png(P_BONUSBOX)


def img(data, x, y, w=None, h=None):
    iw, ih = data[1]
    if w is None:
        w = iw * h / ih
    if h is None:
        h = ih * w / iw
    return f'<image href="{data[0]}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}"/>', w, h


def lockup(x, y, d, partner, vertical=False):
    """Co-branding: jö logo in a white circle + partner logo in a white circle, same size,
    both logos in the partner colour (as in the jö x BIPA lockup). Returns svg; size via lockup_size()."""
    img_p, color = PARTNERS[partner]
    gap = d * 0.08
    lw = d * 0.66
    lh = lw * LOGO_H / LOGO_W
    jx, jy = x, y
    px, py = (x, y + d + gap) if vertical else (x + d + gap, y)
    return (f'<circle cx="{jx + d / 2:.1f}" cy="{jy + d / 2:.1f}" r="{d / 2:.1f}" fill="{WHITE}"/>'
            + logo(jx + (d - lw) / 2, jy + (d - lh) / 2 + d * 0.01, lw, color)
            + f'<image href="{img_p[0]}" x="{px:.1f}" y="{py:.1f}" width="{d:.1f}" height="{d:.1f}"/>')


def lockup_size(d, vertical=False):
    return (d, 2 * d + d * 0.08) if vertical else (2 * d + d * 0.08, d)


def oes_icon(cx, cy, d, bg=WINE, fg=WHITE):
    """Round Ös icon: the ö of the logo, white in a Burgund circle (as in the app's Ös-Pill)."""
    s = d * 0.62 / 183
    gw = (271.15 - 112) * s
    return (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{d / 2:.1f}" fill="{bg}"/>'
            f'<g transform="translate({cx - gw / 2 - 112 * s:.1f} {cy - 183 * s / 2:.1f}) scale({s:.5f})" fill="{fg}">'
            f'<path d="{LP["E"]}"/><circle cx="152.94" cy="16.8" r="16.8"/><circle cx="207.17" cy="16.8" r="16.8"/></g>')


def oes_pill(x, y, label, size, anchor="start"):
    """Ös-Pill: white pill, value in Burgund, round Ös icon at the end."""
    h = size * 1.9
    tw = len(label) * size * 0.6 + size * 0.7 + h * 0.86 + size * 0.35
    if anchor == "end":
        x -= tw
    d = h * 0.78
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{tw:.1f}" height="{h:.1f}" rx="{h / 2:.1f}" fill="{WHITE}"/>'
            f'<text x="{x + size * 0.7:.1f}" y="{y + h / 2 + size * 0.36:.1f}" font-family="Satoshi" font-weight="800" '
            f'font-size="{size:.1f}" fill="{WINE}">{label}</text>'
            + oes_icon(x + tw - h / 2, y + h / 2, d)), tw, h


def deal_tag(x, y, label, size):
    """Rabatt-Tag: deals stand on Burgund."""
    h = size * 1.45
    tw = len(label.replace("&#8239;", "")) * size * 0.58 + size * 0.8
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{tw:.1f}" height="{h:.1f}" rx="{h * 0.22:.1f}" fill="{WINE}"/>'
            f'<text x="{x + tw / 2:.1f}" y="{y + h / 2 + size * 0.36:.1f}" font-family="Satoshi" font-weight="800" '
            f'font-size="{size:.1f}" letter-spacing="{-0.02 * size:.1f}" fill="{WHITE}" text-anchor="middle">{label}</text>'), tw, h


# ---------------------------------------------------------------- PAGRO (Store 1)
def pagro_school(w, h):
    """Stationery photo left, Kachel 50 % from the right: -15 % + 100 Ös auf Schulartikel."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    kw, r, pad = w * 0.5, 0.14 * short, short * 0.085
    kx = w - kw
    out = [f"<defs>{gdef}</defs>", photo(P_STATIONERY[0], P_STATIONERY[1], 0, 0, w, h, (0.45, 0.5)),
           f'<path d="{kachel_path(kx, 0, kw, h, r, "right")}" fill="url(#{gid})"/>']
    out.append(lockup(kx + pad, pad, short * 0.15, "pagro"))
    t, tw, th = deal_tag(kx + pad, h * 0.33, "−15&#8239;%", short * 0.105)
    out.append(t)
    op, _, _ = oes_pill(kx + pad + tw + short * 0.03, h * 0.33 + (th - short * 0.06 * 1.9) / 2, "+100", short * 0.06)
    out.append(op)
    fs = short * 0.098
    out.append(text(kx + pad, h * 0.33 + th + fs * 1.15, ["auf Schulartikel", "bei PAGRO."], fs, WHITE))
    ps = short * 0.048
    p, _, _ = pill(kx + pad, h - pad - ps * 2.3, "In der jö App aktivieren", ps, WHITE, WINE)
    out.append(p)
    return "".join(out)


def pagro_pencils(w, h):
    """Pencil fan photo right, Kachel 50 % from the left: 3fach Ös auf Malsachen."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    kw, r, pad = w * 0.5, 0.14 * short, short * 0.075
    out = [f"<defs>{gdef}</defs>", photo(P_PENCILS[0], P_PENCILS[1], 0, 0, w, h, (0.5, 0.5)),
           f'<path d="{kachel_path(0, 0, kw, h, r, "left")}" fill="url(#{gid})"/>']
    out.append(lockup(pad, pad, short * 0.13, "pagro"))
    fs = short * 0.112
    out.append(text(pad, h * 0.4, ["3fach Ös", "auf Mal-", "sachen."], fs, WHITE))
    sub = short * 0.032
    out.append(text(pad, h * 0.4 + fs * 2.08 + sub * 2.3, ["Stifte, Farben, Blöcke:", "jetzt bei PAGRO dreifach", "Ös sammeln."],
                    sub, WHITE, weight=500, lh=1.3, ls=0))
    ps = short * 0.042
    p, _, _ = pill(pad, h - pad - ps * 2.3, "Jetzt aktivieren", ps, WHITE, WINE)
    out.append(p)
    return "".join(out)


def pagro_small(w, h):
    """Burgund, jö + PAGRO circle lockup, Kachel 50 % from the bottom: Hier Ös sammeln."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    r, kh, pad = 0.14 * short, h * 0.5, w * 0.085
    out = [f"<defs>{gdef}</defs>", f'<rect width="{w}" height="{h}" fill="{WINE}"/>']
    d = w * 0.38
    lwid, _ = lockup_size(d)
    out.append(lockup((w - lwid) / 2, (h - kh - d) / 2, d, "pagro"))
    out.append(f'<path d="{kachel_path(0, h - kh, w, kh, r, "bottom")}" fill="url(#{gid})"/>')
    fs = w * 0.105
    out.append(text(pad, h - kh + pad * 1.2 + fs * 0.8, ["Hier bei PAGRO", "Ös sammeln."], fs, WHITE))
    ps = w * 0.058
    p, _, _ = pill(pad, h - pad - ps * 2.3, "jö App zeigen", ps, WHITE, WINE)
    out.append(p)
    return "".join(out)


# ---------------------------------------------------------------- BIPA (Store 2)
def bipa_hero(w, h):
    """Offer photo right, Kachel from the left: 250 Zusatz Ös auf den Einkauf."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    kw, r, pad = w * 0.47, 0.14 * short, short * 0.085
    out = [f"<defs>{gdef}</defs>", photo(P_BUBBLE[0], P_BUBBLE[1], kw - r, 0, w - kw + r, h, (0.47, 0.5)),
           f'<path d="{kachel_path(0, 0, kw, h, r, "left")}" fill="url(#{gid})"/>']
    out.append(lockup(pad, pad, short * 0.14, "bipa"))
    fs = short * 0.098
    out.append(text(pad, h * 0.4, ["250 Zusatz Ös", "auf deinen", "BIPA Einkauf."], fs, WHITE))
    sub = short * 0.032
    out.append(text(pad, h * 0.4 + fs * 2.08 + sub * 2.4, ["jö App an der Kassa scannen", "und Extra-Ös sammeln."],
                    sub, WHITE, weight=500, lh=1.3, ls=0))
    ps = short * 0.044
    p, _, _ = pill(pad, h - pad - ps * 2.3, "Jetzt aktivieren", ps, WHITE, WINE)
    out.append(p)
    # Ös-Pill on the photo, like on the offer card
    op, _, _ = oes_pill(w - short * 0.07, short * 0.07, "250", short * 0.075, anchor="end")
    out.append(op)
    return "".join(out)


def bipa_pennant(w, h, safe_h):
    """Tall pennant: Burgund with lockup + headline, Bonusbox on the Kachel, Ös-Pill, pill button."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    pad = w * 0.11
    out = [f"<defs>{gdef}</defs>", f'<rect width="{w}" height="{h}" fill="{WINE}"/>']
    d = w * 0.36
    lwid, _ = lockup_size(d)
    out.append(lockup((w - lwid) / 2, h * 0.05, d, "bipa"))
    fs = w * 0.14
    out.append(text(pad, h * 0.24, ["Die BIPA", "Bonusbox", "für 250 Ös."], fs, WHITE))
    kh, r = h * 0.52, 0.14 * short
    out.append(f'<path d="{kachel_path(0, h - kh, w, kh, r, "bottom")}" fill="url(#{gid})"/>')
    bw = w * 0.84
    by = h - kh - w * 0.32
    bi, _, bh = img(P_BONUSBOX, (w - bw) / 2, by, bw)
    out.append(bi)
    os_ = w * 0.1
    op, _, _ = oes_pill(w / 2 - os_ * 2.2, by + bh + w * 0.12, "250", os_)
    out.append(op)
    sub = w * 0.06
    out.append(text(w / 2, by + bh + w * 0.12 + os_ * 1.9 + sub * 2.2, ["Mit deinen Ös", "einlösen und", "Neues entdecken."],
                    sub, WHITE, weight=500, lh=1.3, ls=0, anchor="middle"))
    ps = w * 0.058
    p, _, _ = pill(w / 2, safe_h - pad - ps * 2.3, "Mit Ös einlösen", ps, WHITE, WINE, anchor="middle")
    out.append(p)
    return "".join(out)


# ---------------------------------------------------------------- compose
def bbox(d):
    nums = list(map(float, re.findall(r"-?\d+\.?\d*", d)))
    xs, ys = nums[0::2], nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)


def build(src_name, out_name, layouts):
    svg = open(os.path.join(SRC, src_name)).read()
    root = re.search(r"<svg[^>]*>", svg).group(0)
    areas = re.findall(r'<path id="([^"]+)" d="([^"]+)"/>', svg)
    parts = [root, f'<title>jö Store-Werbeflächen · {out_name}</title>',
             f'<style>@font-face{{font-family:"Satoshi";src:url(data:font/woff2;base64,{FONT_B64}) format("woff2");'
             f'font-weight:300 900}}</style>', '<g id="joe-ads">']
    for aid, d in areas:
        x0, y0, x1, y1 = bbox(d)
        w, h = x1 - x0, y1 - y0
        cid = uid("area")
        local = re.sub(r"(-?\d+\.?\d*) (-?\d+\.?\d*)",
                       lambda m: f"{float(m.group(1)) - x0:g} {float(m.group(2)) - y0:g}", d)
        body = layouts[aid](w, h, local)
        parts.append(f'<g id="{aid}" transform="translate({x0:g} {y0:g})">'
                     f'<clipPath id="{cid}"><path d="{local}"/></clipPath>'
                     f'<g clip-path="url(#{cid})">{body}</g></g>')
    parts.append("</g></svg>")
    open(os.path.join(HERE, out_name), "w").write("\n".join(parts))
    print("wrote", out_name, [a for a, _ in areas])


build("Store1-vectors.svg", "Store1-ads.svg", {      # PAGRO
    "area-01": lambda w, h, d: pagro_school(w, h),
    "area-02": lambda w, h, d: pagro_pencils(w, h),
    "area-03": lambda w, h, d: pagro_small(w, h),
})
build("Store2-vectors.svg", "Store2-ads.svg", {      # BIPA
    "area-01": lambda w, h, d: bipa_hero(w, h),
    "area-02": lambda w, h, d: bipa_pennant(w, h, 9228 - 3515),
})
