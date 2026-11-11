"""jö store ads: places brand-compliant ads into the red areas of the store vector files.

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


# ---------------------------------------------------------------- photos
P_FAMILY = img_data("iv_einkauf.webp")             # mother + child in supermarket
P_CHECKOUT = img_data("ooh/tamara_f.webp")         # scanning the jö app at the till
P_CUTOUT = img_data("ooh/ubahn_frau.webp", 1200, "PNG")  # cut-out, walking with phone


# ---------------------------------------------------------------- ad layouts (local coords, 0..w, 0..h)
def ad_family_landscape(w, h):
    """Photo panel left, Kachel 50 % from the right with headline, logo and pill."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    r = 0.14 * short
    kw = w * 0.5
    kx = w - kw
    pad = short * 0.09
    out = [f"<defs>{gdef}</defs>", photo(P_FAMILY[0], P_FAMILY[1], 0, 0, w, h, (0.62, 0.4)),
           f'<path d="{kachel_path(kx, 0, kw, h, r, "right")}" fill="url(#{gid})"/>']
    lw = kw * 0.26
    out.append(logo(kx + pad, pad, lw, WHITE))
    fs = short * 0.125
    out.append(text(kx + pad, h * 0.43, ["Bei jedem", "Einkauf", "Ös sammeln."], fs, WHITE, hl=(2, "Ös", LORANGE)))
    p, _, _ = pill(kx + pad, h - pad - short * 0.05 * 2.3, "jö App holen", short * 0.05, WHITE, WINE)
    out.append(p)
    return "".join(out)


def ad_cutout_square(w, h):
    """Full jö-Verlauf, cut-out person right, headline left, white pill."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    pad = short * 0.075
    iw, ih = P_CUTOUT[1]
    ph = h * 0.98
    pw = iw * ph / ih
    out = [f"<defs>{gdef}</defs>", f'<rect width="{w}" height="{h}" fill="url(#{gid})"/>',
           f'<image href="{P_CUTOUT[0]}" x="{w - pw - w * 0.02:.1f}" y="{h - ph + h * 0.04:.1f}" width="{pw:.1f}" height="{ph:.1f}"/>']
    out.append(logo(pad, pad, w * 0.2, WHITE))
    fs = short * 0.098
    out.append(text(pad, h * 0.48, ["Sammeln.", "Sparen.", "Freuen."], fs, WHITE, hl=(1, "Sparen.", LORANGE)))
    sub = short * 0.035
    out.append(text(pad, h * 0.48 + fs * 2.04 + sub * 2.2, ["Bei allen jö Partnern", "Ös sammeln und einlösen."],
                    sub, WHITE, weight=500, lh=1.3, ls=0))
    p, _, _ = pill(pad, h - pad - short * 0.045 * 2.3, "Jetzt jö App holen", short * 0.045, WHITE, WINE)
    out.append(p)
    return "".join(out)


def ad_portrait_small(w, h):
    """Beige, Burgund logo, Kachel 50 % from the bottom with headline + pill."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    r = 0.14 * short
    kh = h * 0.5
    pad = w * 0.085
    out = [f"<defs>{gdef}</defs>", f'<rect width="{w}" height="{h}" fill="{BEIGE}"/>']
    lw = w * 0.62
    out.append(logo((w - lw) / 2, (h - kh - lw * LOGO_H / LOGO_W) / 2, lw, WINE))
    out.append(f'<path d="{kachel_path(0, h - kh, w, kh, r, "bottom")}" fill="url(#{gid})"/>')
    fs = w * 0.098
    out.append(text(pad, h - kh + pad * 1.2 + fs * 0.8, ["Ös sammeln.", "Rabatte holen."], fs, WHITE, hl=(0, "Ös", LORANGE)))
    p, _, _ = pill(pad, h - pad - w * 0.058 * 2.3, "Mehr in der App", w * 0.058, WHITE, WINE)
    out.append(p)
    return "".join(out)


def ad_checkout_hero(w, h, notch_y):
    """Big hero: checkout photo, Kachel 50 % from the left. notch_y = height where the bottom-right notch starts."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    r = 0.14 * short
    kw = w * 0.47
    pad = short * 0.085
    out = [f"<defs>{gdef}</defs>", photo(P_CHECKOUT[0], P_CHECKOUT[1], 0, 0, w, h, (0.32, 0.4)),
           f'<path d="{kachel_path(0, 0, kw, h, r, "left")}" fill="url(#{gid})"/>']
    out.append(logo(pad, pad, kw * 0.24, WHITE))
    fs = short * 0.09
    out.append(text(pad, h * 0.44, ["Einfach zeigen.", "Ös sammeln."], fs, WHITE, hl=(1, "Ös", LORANGE)))
    sub = short * 0.032
    out.append(text(pad, h * 0.44 + fs * 1.04 + sub * 2.4,
                    ["App an der Kassa scannen,", "Ös sammeln und bei jedem", "jö Partner einlösen."],
                    sub, WHITE, weight=500, lh=1.3, ls=0))
    ps = short * 0.042
    p, _, _ = pill(pad, h - pad - ps * 2.3, "Jetzt jö App holen", ps, WHITE, WINE)
    out.append(p)
    return "".join(out)


def ad_pennant(w, h, safe_h):
    """Tall pennant: Burgund with white logo + headline, Kachel 50 % from the bottom with pill."""
    gid, gdef = gradient(w, h)
    short = min(w, h)
    pad = w * 0.12
    out = [f"<defs>{gdef}</defs>", f'<rect width="{w}" height="{h}" fill="{WINE}"/>']
    lw = w * 0.66
    out.append(logo((w - lw) / 2, h * 0.07, lw, WHITE))
    fs = w * 0.155
    out.append(text(pad, h * 0.29, ["Mehr", "vom", "Einkauf."], fs, WHITE, hl=(2, "Einkauf.", LORANGE)))
    kh = h * 0.5
    r = 0.14 * short
    out.append(f'<path d="{kachel_path(0, h - kh, w, kh, r, "bottom")}" fill="url(#{gid})"/>')
    iw, ih = P_CUTOUT[1]
    pw = w * 0.92
    ph = ih * pw / iw
    out.append(f'<image href="{P_CUTOUT[0]}" x="{(w - pw) / 2:.1f}" y="{h - kh - ph * 0.22:.1f}" width="{pw:.1f}" height="{ph:.1f}"/>')
    ps = w * 0.062
    p, _, _ = pill(w / 2, safe_h - pad - ps * 2.3, "jö App holen", ps, WHITE, WINE, anchor="middle")
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


build("Store1-vectors.svg", "Store1-ads.svg", {
    "area-01": lambda w, h, d: ad_family_landscape(w, h),
    "area-02": lambda w, h, d: ad_cutout_square(w, h),
    "area-03": lambda w, h, d: ad_portrait_small(w, h),
})
build("Store2-vectors.svg", "Store2-ads.svg", {
    "area-01": lambda w, h, d: ad_checkout_hero(w, h, 8592 - 5077),
    "area-02": lambda w, h, d: ad_pennant(w, h, 9228 - 3515),
})
