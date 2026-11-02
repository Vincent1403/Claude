# Topo trophy terrain

Turns the brand topo pattern (`topo-pattern.webp`) into the stacked layers used by the
"Topo" version in `../index.html` (the `TOPO` constant).

```bash
python analyze.py topo-pattern.webp out          # contour lines -> bands between them
python height.py out                             # bands -> elevation (closed loops = summits)
python layers.py out 150 160 760                 # square crop x y size -> out/levels.json
```

Needs numpy, scipy, scikit-image, pillow. Paste `out/levels.json` into `TOPO` in `index.html`.

The pattern's lines carry no heights, so elevation is inferred: nested closed loops are hills
(inner = higher) and the ground drops one level per line crossed moving away from the summits.
