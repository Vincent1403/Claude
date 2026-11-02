# Per-level outlines (SVG path, even-odd) of a square crop of the elevation field.
import sys, json, numpy as np
from scipy import ndimage as ndi
from skimage import measure
out = sys.argv[1]; x0, y0, size = map(int, sys.argv[2:5])
Z = np.load(out + '/elev.npy')
crop = Z[y0:y0+size, x0:x0+size]
lo, hi = int(crop.min()), int(crop.max())
levels = []
for k in range(lo + 1, hi + 1):             # level lo is the full square (the plinth)
    m = ndi.gaussian_filter((Z >= k).astype(float), 3.0)[y0:y0+size, x0:x0+size]
    m = np.pad(m, 1)                          # closes outlines along the crop edge with a crisp cut
    parts = []
    for c in measure.find_contours(m, 0.5):
        c = measure.approximate_polygon(c, 0.5)
        if len(c) < 4: continue
        area = 0.5 * abs(np.dot(c[:,1], np.roll(c[:,0],1)) - np.dot(c[:,0], np.roll(c[:,1],1)))
        if area < 40: continue               # specks
        pts = np.clip(c - 1, 0, size)        # undo pad; (row, col)
        parts.append('M' + 'L'.join(f'{p[1]:.1f},{p[0]:.1f}' for p in pts) + 'Z')
    if parts: levels.append({'k': k - lo, 'd': ''.join(parts)})
print('levels', lo, hi, 'count', len(levels), 'chars', sum(len(l['d']) for l in levels))
json.dump({'size': size, 'levels': levels}, open(out + '/levels.json', 'w'), separators=(',', ':'))
