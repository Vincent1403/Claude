#!/usr/bin/env python3
"""Colours the line-art SVGs from the ORF illustration library and inlines them into index.html.

Source: referenz/library/*.stroke.svg (exported from the "ORF Illustration Set" artifact; each has a
#fills group of white regions in drawing order and a #lines group). ROLES below says which region is
what; the colours live in index.html as CSS classes on the regions (.p-skin, .p-blue, ...), so the
palette can be changed without touching this script.

Run:  python3 build_assets.py   (rewrites the <script id="illu"> block in index.html)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
LIB = ROOT / "referenz" / "library"
PAGE = ROOT / "index.html"

# region index -> role, per asset. Roles map to classes in the page CSS.
# Figures: skin, hair, blue (trousers), glove, shoe, sole; objects: red, red2 (darker side), cream, ink, sun (gradient).
ROLES = {
    "lupe": {  # ORF-02: crouching figure with magnifier
        0: "glass", 1: "blue", 2: "skin", 3: "red", 4: "hair", 5: "glove", 6: "glove",
        7: "shoe", 8: "shoe", 9: "ink", 10: "cream",
    },
    "laeufer": {  # ORF-03: running figure with megaphone
        0: "skin", 1: "red", 2: "blue", 3: "glove", 4: "shoe", 5: "shoe", 6: "glove", 7: "cream", 8: "ink",
        9: "sole", 10: "cream", 11: "skin", 12: "ink", 13: "sole", 14: "glove", 15: "sole", 16: "ink", 17: "blue", 18: "blue",
    },
    "block": {  # ORF-04: extruded ORF block
        0: "sun", 1: "cream", 2: "red2", 3: "cream", 4: "cream", 5: "cream", 6: "sun", 7: "sun",
    },
    "archiv": {  # ORF-05: figure carrying the archive box
        0: "red", 1: "skin", 2: "skin", 3: "blue", 4: "shoe", 5: "hair", 6: "red2", 7: "glove", 8: "glove",
        9: "cream", 10: "shoe", 11: "red2", 12: "sole", 13: "blue", 14: "red2", 15: "cream", 16: "red", 17: "ink",
    },
    "boombox": {  # ORF-06: figure with a boombox for a head
        0: "red", 1: "skin", 2: "blue", 3: "shoe", 4: "cream", 5: "cream", 6: "shoe", 7: "glove", 8: "glove",
        9: "ink", 10: "red2", 11: "cream", 12: "sole", 13: "ink", 14: "sun", 15: "sun", 16: "ink", 17: "ink",
        18: "cream", 19: "cream", 20: "cream", 21: "cream", 22: "ink", 23: "ink", 24: "ink",
    },
    "muenze": {  # ORF-07: 50 cent coin
        0: "sun", 1: "cream", 2: "cream", 9: "cream", 10: "cream", 11: "cream", 13: "cream", 12: "sun", 20: "sun",
        **{i: "cream" if i % 2 else "red2" for i in (3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 21, 22, 23)},
    },
    "megafon": {  # ORF-08
        0: "red", 1: "ink", 2: "ink", 3: "ink", 4: "cream", 5: "cream", 6: "ink",
    },
    "cursor": {  # ORF-09: extruded arrow
        0: "sun", 1: "sun2", 2: "red2", 3: "sun2", 4: "red2", 5: "sun2",
    },
    "handy": {  # ORF-10: phone with a notification
        0: "cream", 1: "red", 2: "red2", 3: "red2", 4: "red2", 5: "red", 6: "ink",
    },
    "tasten": {  # ORF-11: O R F keycaps
        0: "cream", 1: "cream", 2: "cream", 3: "sun2", 4: "sun2", 5: "sun2", 6: "red2", 7: "red2", 8: "red2",
        9: "red", 10: "red", 11: "shadow", 12: "shadow", 13: "shadow", 14: "red", 15: "red", 16: "red",
    },
}
FILES = {
    "lupe": "00_ORF-02.svg.stroke.svg", "laeufer": "01_ORF-03.svg.stroke.svg", "block": "02_ORF-04.svg.stroke.svg",
    "archiv": "03_ORF-05.svg.stroke.svg", "boombox": "04_ORF-06.svg.stroke.svg", "muenze": "05_ORF-07.svg.stroke.svg",
    "megafon": "06_ORF-08.svg.stroke.svg", "cursor": "07_ORF-09.svg.stroke.svg", "handy": "08_ORF-10.svg.stroke.svg",
    "tasten": "09_ORF-11.svg.stroke.svg",
}


def colour(name: str) -> dict:
    svg = (LIB / FILES[name]).read_text(encoding="utf-8")
    roles = ROLES[name]
    view = re.search(r'viewBox="([^"]+)"', svg).group(1)
    fills = re.search(r'<g id="fills"[^>]*>(.*?)</g>', svg, re.S).group(1)
    lines = re.search(r'<g id="lines"[^>]*>(.*?)</g>', svg, re.S)
    line_attrs = re.search(r'<g id="lines"([^>]*)>', svg).group(1)
    paths = re.findall(r"<path[^>]*/>", fills)
    out = []
    for i, p in enumerate(paths):
        role = roles.get(i, "cream")
        out.append(p.replace("<path ", f'<path class="p-{role}" '))
    body = (
        '<g class="fills" fill-rule="evenodd">' + "".join(out) + "</g>"
        + f"<g class=\"lines\"{line_attrs}>{lines.group(1)}</g>"
    )
    body = re.sub(r"\s+", " ", body)
    return {"viewBox": view, "body": body}


def main() -> None:
    data = {name: colour(name) for name in FILES}
    blob = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    page = PAGE.read_text(encoding="utf-8")
    new = f'<script id="illu" type="application/json">{blob}</script>'
    if '<script id="illu"' in page:
        page = re.sub(r'<script id="illu" type="application/json">.*?</script>', lambda m: new, page, flags=re.S)
    else:
        page = page.replace("<!-- ILLU -->", new)
    PAGE.write_text(page, encoding="utf-8")
    print("inlined", len(data), "illustrations,", len(blob) // 1024, "KB")


if __name__ == "__main__":
    main()
