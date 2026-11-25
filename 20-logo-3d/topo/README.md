# Topo trophy

Turns the brand topo pattern (`topo-pattern.webp`) into the carved front face of the upright
wooden "Topo" block in `../index.html` (the `TOPO` constant).

```bash
python analyze.py topo-pattern.webp out                              # contour lines -> bands between them
python height.py out                                                 # bands -> elevation (closed loops = summits)
python carve.py topo-pattern.webp out/elev.npy out/carve.json 250 470 -2 0.55 2.585 0.05 --no-markers   # crop x, crop width, carve floor; plain "20" 55% wide, 5% margins
python carve.py topo-pattern.webp out/elev.npy out/cert.json 100 758 -2 0.55 2.796 0.05 --surface 0 --down 3 --up 4 --no-markers --ease 30 --zone 37,909,126,126 --zone 461,909,260,126  # A4 crop; text 55% wide; relief both ways; flat corners for the Sunlight logo and the partner name
```

Needs numpy, scipy, scikit-image, pillow. Paste `out/carve.json` into `TOPO` (upright block) and
`out/cert.json` into `CERT` (A4 certificate, 210 x 297 x 10 mm) in `index.html`.

- Elevation is inferred, since the pattern's lines carry no heights: nested closed loops are hills
  (inner = higher) and the ground drops one level per line crossed moving away from the summits.
- Block: bands at or below the carve floor stay at the surface; each level above it is carved one
  step deeper, so the summits become the deepest pockets.
- Certificate (`--surface 0 --down 3 --up 4`): contour level 0 is the board surface; higher ground
  is raised out of the wood up to 4 steps (mountains), lower ground carved in down to 3 steps.
- A flat area at the bottom left is kept for the engraved logo, at the level most of it already
  has. `carve.py` can also engrave the pattern's crosses and squares (leave out `--no-markers`);
  neither piece uses them now.
