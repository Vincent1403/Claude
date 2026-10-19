"""Baut index.html: setzt die Satoshi-Schrift und die Logo-Pfade aus dem Markenfilm in src.html ein."""
import base64
import json
import pathlib

here = pathlib.Path(__file__).parent
film = here.parent / "joe-strategiefilm" / "assets"
src = (here / "src.html").read_text(encoding="utf-8")
lp = json.loads((film / "logo-beats.json").read_text(encoding="utf-8"))["LP"]

out = src.replace("__FONT__", base64.b64encode((film / "satoshi.woff2").read_bytes()).decode()).replace(
    "__LOGO__", json.dumps(lp, separators=(",", ":"))
)
(here / "index.html").write_text(out, encoding="utf-8")
print(f"index.html: {len(out) / 1e3:.0f} kB")
