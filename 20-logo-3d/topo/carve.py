# Upright block: the topo pattern carved into the front face.
# Output coords are crop pixels with y UP (0 = bottom of the face).
#   levels[j].d : outline of front-face layer j (j = 0 is the surface), i.e. where carve depth <= j
#   markers     : pattern crosses / squares, engraved one layer deep into the layer j they sit on
#   logo        : flat area kept for the engraved "20"
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage import measure
img_path, elev_path, out = sys.argv[1:4]
x0, w, zf = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
logo_frac = float(sys.argv[7]) if len(sys.argv) > 7 else 0.55   # logo width / face width
Z = np.load(elev_path); H = Z.shape[0]; h = H
c = np.clip(Z[:, x0:x0+w] - zf, 0, None)
# logo zone (y down here): logo_frac of width, 8% left margin, 10% bottom margin; forced flat
lw = int(w * logo_frac); lh = int(lw / 2.064); mx = int(w * 0.08); my = int(w * 0.10)
ly0 = h - my - lh
c[ly0-14:h-my+14, mx-14:mx+lw+14] = 0
L = int(c.max())
levels = []
for j in range(L):
    m = ndi.gaussian_filter((c <= j).astype(float), 3.0)
    m = np.pad(m, 1)
    parts = []
    for ct in measure.find_contours(m, 0.5):
        ct = measure.approximate_polygon(ct, 0.5)
        if len(ct) < 4: continue
        area = 0.5 * abs(np.dot(ct[:,1], np.roll(ct[:,0],1)) - np.dot(ct[:,0], np.roll(ct[:,1],1)))
        if area < 40: continue
        p = np.clip(ct - 1, 0, [h, w])
        parts.append('M' + 'L'.join(f'{q[1]:.1f},{h - q[0]:.1f}' for q in p) + 'Z')
    levels.append({'j': j, 'd': ''.join(parts)})
# markers: small bright blobs in the pattern (squares, crosses). Ones outside the crop are wrapped
# into it horizontally; each is nudged (<= 60 px) to the nearest spot that sits on a single terrace.
full = np.asarray(Image.open(img_path).convert('L')) > 135
lab, n = ndi.label(full, structure=np.ones((3, 3)))
markers = []
def ok(cx, cy, r):
    y_a, y_b, x_a, x_b = int(cy - r), int(cy + r), int(cx - r), int(cx + r)
    if y_a < 6 or x_a < 6 or y_b > h - 6 or x_b > w - 6: return None
    if not (x_b < mx - 20 or x_a > mx + lw + 20 or y_b < ly0 - 20): return None   # keep off the logo
    for m in markers:                                                              # no crowding
        if abs(m['x'] - cx) < 50 and abs((h - m['y']) - cy) < 50: return None
    patch = c[y_a:y_b, x_a:x_b]
    return int(patch.min()) if patch.min() == patch.max() else None
for i, sl in enumerate(ndi.find_objects(lab), 1):
    bh, bw = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
    if max(bh, bw) > 60 or min(bh, bw) < 8: continue
    fill = (lab[sl] == i).mean()
    kind = 'square' if fill > 0.6 else ('cross' if 0.15 < fill < 0.45 and abs(bh - bw) < 8 else None)
    if not kind: continue
    s_ = 14 if kind == 'square' else 40
    cy, cx = (sl[0].start + sl[0].stop) / 2, ((sl[1].start + sl[1].stop) / 2 - x0) % w
    r = s_ / 2 + 8
    best = None
    for d in range(0, 61, 4):
        for dy in range(-d, d + 1, 4):
            for dx in (-d, d) if abs(dy) != d else range(-d, d + 1, 4):
                j = ok(cx + dx, cy + dy, r)
                if j is not None: best = (cx + dx, cy + dy, j); break
            if best: break
        if best: break
    if best:
        markers.append({'type': kind, 'x': round(best[0], 1), 'y': round(h - best[1], 1), 's': s_, 'j': best[2]})
print('w', w, 'h', h, 'depth levels', L, 'markers', [(m['type'], m['s']) for m in markers])
json.dump({'w': w, 'h': h, 'levels': levels, 'markers': markers,
           'logo': {'x': mx, 'y': my, 'w': lw}}, open(out, 'w'), separators=(',', ':'))
