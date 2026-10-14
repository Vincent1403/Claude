"""Baut index.html: setzt Schrift, Musik, Logo-/Beat-Daten und Bilder aus der Animatic als data-URIs in src.html ein."""
import base64
import pathlib

here = pathlib.Path(__file__).parent
assets = here / "assets"
src = (here / "src.html").read_text(encoding="utf-8")
b64 = lambda p: base64.b64encode((assets / p).read_bytes()).decode()

out = (
    src.replace("__FONT__", b64("satoshi.woff2"))
    .replace("__MUSIC__", b64("music.mp3"))
    .replace("__DATA__", (assets / "logo-beats.json").read_text(encoding="utf-8"))
    .replace("__ANIM__", (assets / "animatic.json").read_text(encoding="utf-8"))
)
(here / "index.html").write_text(out, encoding="utf-8")
print(f"index.html: {len(out) / 1e6:.2f} MB")
