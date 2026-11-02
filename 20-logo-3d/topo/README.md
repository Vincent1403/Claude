# Topo trophy

Turns the brand topo pattern (`topo-pattern.webp`) into the carved front face of the upright
wooden "Topo" block in `../index.html` (the `TOPO` constant).

```bash
python analyze.py topo-pattern.webp out                              # contour lines -> bands between them
python height.py out                                                 # bands -> elevation (closed loops = summits)
python carve.py topo-pattern.webp out/elev.npy out/carve.json 250 470 -2   # crop x, crop width, carve floor
```

Needs numpy, scipy, scikit-image, pillow. Paste `out/carve.json` into `TOPO` in `index.html`.

- Elevation is inferred, since the pattern's lines carry no heights: nested closed loops are hills
  (inner = higher) and the ground drops one level per line crossed moving away from the summits.
- Bands at or below the carve floor stay at the block surface; each level above it is carved one
  step deeper, so the summits become the deepest pockets.
- A flat area at the bottom left is kept for the engraved "20". The pattern's crosses and squares
  are engraved into whichever terrace they land on (nudged off terrace edges).
