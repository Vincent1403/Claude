#!/usr/bin/env python3
"""Turns the static .dc.html spreads from the design canvas into standalone HTML.

src/<Name>.dc.html  ->  spreads/<Name>.html  (+ index.html with all spreads)
Only for static spreads: <x-dc>/<helmet> are unwrapped, the DC script is dropped.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC, OUT = ROOT / "src", ROOT / "spreads"
ORDER = ["Vertrauen", "Megafon", "Kuvert"]  # Heft-Reihenfolge

PAGE = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
{head}
<style>@page{{size:420mm 297mm;margin:0}}@media print{{html,body{{width:1588px;height:1123px}}}}</style>
</head>
<body>
{body}
</body>
</html>
"""


def convert(path: Path) -> tuple[str, str]:
    src = path.read_text(encoding="utf-8")
    title = re.search(r"<title>(.*?)</title>", src, re.S).group(1).strip()
    xdc = re.search(r"<x-dc>(.*?)</x-dc>", src, re.S).group(1)
    helmet = re.search(r"<helmet>(.*?)</helmet>", xdc, re.S)
    head = helmet.group(1).strip() if helmet else ""
    body = re.sub(r"<helmet>.*?</helmet>", "", xdc, flags=re.S).strip()
    if "{{" in body:
        raise SystemExit(f"{path.name}: has template holes, not a static spread")
    return title, PAGE.format(title=title, head=head, body=body)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    names = sorted(p.name.removesuffix(".dc.html") for p in SRC.glob("*.dc.html"))
    names.sort(key=lambda n: ORDER.index(n) if n in ORDER else len(ORDER))
    cards = []
    for name in names:
        title, html = convert(SRC / f"{name}.dc.html")
        (OUT / f"{name}.html").write_text(html, encoding="utf-8")
        cards.append(
            f'<figure><a href="spreads/{name}.html"><div class="fit"><iframe src="spreads/{name}.html" '
            f'title="{title}" tabindex="-1"></iframe></div></a>'
            f"<figcaption>{title}</figcaption></figure>"
        )
        print("built", f"spreads/{name}.html")
    (ROOT / "index.html").write_text(INDEX.replace("{cards}", "\n".join(cards)), encoding="utf-8")
    print("built index.html")


INDEX = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gerade jetzt – Doppelseiten</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap">
<style>
body{margin:0;padding:32px 16px 64px;background:#EDEDED;color:#111;font-family:Archivo,system-ui,sans-serif}
h1{max-width:1200px;margin:0 auto 24px;font-weight:900;font-stretch:62%;font-size:56px;text-transform:uppercase;line-height:.9}
figure{max-width:1200px;margin:0 auto 40px}
.fit{position:relative;width:100%;aspect-ratio:1588/1123;overflow:hidden;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.15)}
.fit iframe{position:absolute;left:0;top:0;width:1588px;height:1123px;border:0;transform-origin:0 0;pointer-events:none}
figcaption{margin-top:10px;font-size:14px;font-weight:700}
</style>
<script>
addEventListener('load',()=>{const f=()=>document.querySelectorAll('.fit').forEach(b=>{b.firstElementChild.style.transform='scale('+b.clientWidth/1588+')'});f();addEventListener('resize',f)});
</script>
</head>
<body>
<h1>Gerade jetzt – Doppelseiten</h1>
{cards}
</body>
</html>
"""

if __name__ == "__main__":
    main()
