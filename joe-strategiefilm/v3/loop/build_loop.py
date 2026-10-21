# Baut billa_loop.html: Kartenbilder als data-URIs, Musik und MP4 liegen daneben
import base64, json, pathlib
here = pathlib.Path(__file__).parent
cards = here.parent / "wall_img" / "cards"
imgs = {p.stem: "data:image/webp;base64," + base64.b64encode(p.read_bytes()).decode() for p in cards.glob("*.webp")}
s = (here / "loop_template.html").read_text(encoding="utf-8").replace("__IMGS__", json.dumps(imgs))
(here / "billa_loop.html").write_text(s, encoding="utf-8")
