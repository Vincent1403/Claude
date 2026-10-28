"""Cut the frames out of referenz_archiv_figur.webp into aligned 280x360 cells (raw_*.png).

Usage: python3 cut.py referenz_archiv_figur.webp <outdir>; then python3 sheet.py <outdir>/../assets/archiv_figur.webp from <outdir>.
Segment x-ranges and baselines below are measured on the reference sheet."""
import sys, json
from collections import deque
import numpy as np
from PIL import Image, ImageDraw
SRC = sys.argv[1]; OUT = sys.argv[2]
im = np.asarray(Image.open(SRC).convert('RGB')).astype(int)
H, W = im.shape[:2]
CW, CH, FOOT = 280, 360, 352  # cell size, feet baseline inside the cell
FRAMES = {
  'r': [(209,413), (475,665), (739,929), (1009,1203), (1275,1490)],
  'l': [(162,366), (434,627), (694,887), (960,1149), (1207,1419)],
  'f': [(1509,1724)],
}
BOTTOM = {'r': 370, 'l': 798, 'f': 807}   # lowest shoe pixel per row
TOPS = {'r': 0, 'l': 440, 'f': 440}
red = (im[:,:,0] > 170) & (im[:,:,1] < 110) & (im[:,:,2] < 110)

def label(mask):
    """4-connected components of True pixels; returns label array."""
    lab = np.zeros(mask.shape, int); n = 0
    h, w = mask.shape
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n
                while q:
                    cy, cx = q.popleft()
                    for ny, nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n; q.append((ny, nx))
    return lab, n

cells = {}
for key, segs in FRAMES.items():
    for i, (x0, x1) in enumerate(segs):
        y1 = BOTTOM[key] + 1
        y0 = TOPS[key]
        region = im[y0:y1, x0-4:x1+4]
        rr = red[y0:y1, x0-4:x1+4]
        cx = np.where(rr)[1].mean()            # torso anchor: centroid of the red sweater
        cell = np.full((CH, CW, 3), 255, np.uint8)
        ox = int(round(CW/2 - cx)); oy = FOOT - (y1 - y0)
        hh, ww = region.shape[:2]
        sy0 = max(0, -oy); sx0 = max(0, -ox)
        cell[oy+sy0:oy+hh, ox+sx0:ox+ww] = region[sy0:, sx0:]
        cells[f'{key}{i}'] = cell

json.dump({k: None for k in cells}, open(OUT + '/names.json', 'w'))
for k, c in cells.items():
    Image.fromarray(c).save(f'{OUT}/raw_{k}.png')
