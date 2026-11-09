# Relief for the front face of a topo board: carved into the wood and/or raised out of it.
# Output coords are crop pixels with y UP (0 = bottom of the face). Relief is in whole steps:
# level r = 0 is the board's front surface, r < 0 carved in, r > 0 raised out.
#   slabs[i] = {k, d} : outline (even-odd SVG path) of everything at level >= k; slab k fills the
#                       step from k-1 to k, for k = kmin+1 .. kmax (the board itself is solid
#                       below kmin)
#   markers           : pattern crosses / squares, engraved one step into the level k they sit on
#   logo              : flat area kept for the engraved logo, at level k
#
#   python carve.py IMG ELEV OUT X0 W FLOOR [LOGO_FRAC LOGO_ASPECT MARGIN] [options]
#     default: carve only. Bands at or below FLOOR stay at the surface; each level above is one
#     step deeper (the summits become the deepest pockets).
#     --surface Z0 --down N --up N : relief both ways instead. Contour level Z0 is the surface,
#     higher ground is raised up to N steps, lower ground carved down to N steps (FLOOR unused).
#     --no-markers : leave out the crosses / squares.
#     --ease PX    : instead of flattening a hard rectangle for the logo, let the terrain ease into
#                    it (one level per PX px of distance), so contours curve around it smoothly.
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage import measure
args = [a for a in sys.argv[1:]]
opts = {}
for name in ('--surface', '--down', '--up', '--ease'):
    if name in args:
        i = args.index(name); opts[name] = int(args[i + 1]); del args[i:i + 2]
no_markers = '--no-markers' in args
args = [a for a in args if a != '--no-markers']
img_path, elev_path, out = args[0:3]
x0, w, zf = int(args[3]), int(args[4]), int(args[5])
logo_frac = float(args[6]) if len(args) > 6 else 0.55   # logo width / face width
logo_aspect = float(args[7]) if len(args) > 7 else 2.064  # logo width / height
margin = float(args[8]) if len(args) > 8 else None      # logo margin (x and y) / face width
Z = np.load(elev_path); h = Z.shape[0]
crop = Z[:, x0:x0+w]
if '--surface' in opts:
    r = np.clip(crop - opts['--surface'], -opts['--down'], opts['--up'])
else:
    r = -np.clip(crop - zf, 0, None)
# logo zone (y down here): logo_frac of width; forced flat at the level most of it already has
lw = int(w * logo_frac); lh = int(lw / logo_aspect)
mx, my = (int(w * margin),) * 2 if margin else (int(w * 0.08), int(w * 0.10))
ly0 = h - my - lh
zone = (slice(ly0 - 14, h - my + 14), slice(mx - 14, mx + lw + 14))
vals, counts = np.unique(r[zone], return_counts=True)
logo_k = int(vals[counts.argmax()])
if '--ease' in opts:
    # Ease the terrain into the flat zone instead of cutting it off at the rectangle: at distance d
    # (px) from the zone the relief may differ from the logo level by at most d / RAMP levels, so
    # contours that would cross the zone bend around it in smooth, rounded curves.
    # The flat zone is a squircle (|x/a|^4 + |y/b|^4 <= 1) just enclosing the rectangle, so the
    # curves around it have no straight runs.
    ramp = opts['--ease']
    (ys, xs) = zone
    cy, cx = (ys.start + ys.stop) / 2, (xs.start + xs.stop) / 2
    a_, b_ = (xs.stop - xs.start) / 2 * 2 ** 0.25, (ys.stop - ys.start) / 2 * 2 ** 0.25
    yy, xx = np.mgrid[0:r.shape[0], 0:r.shape[1]]
    inzone = ((xx - cx) / a_) ** 4 + ((yy - cy) / b_) ** 4 <= 1
    d = ndi.distance_transform_edt(~inzone)
    r = np.clip(r, np.ceil(logo_k - d / ramp), np.floor(logo_k + d / ramp)).astype(int)
else:
    r[zone] = logo_k
kmin, kmax = int(r.min()), int(r.max())
slabs = []
for k in range(kmin + 1, kmax + 1):
    m = ndi.gaussian_filter((r >= k).astype(float), 3.0)
    m = np.pad(m, 1)
    parts = []
    for ct in measure.find_contours(m, 0.5):
        ct = measure.approximate_polygon(ct, 0.5)
        if len(ct) < 4: continue
        area = 0.5 * abs(np.dot(ct[:,1], np.roll(ct[:,0],1)) - np.dot(ct[:,0], np.roll(ct[:,1],1)))
        if area < 40: continue
        p = np.clip(ct - 1, 0, [h, w])
        parts.append('M' + 'L'.join(f'{q[1]:.1f},{h - q[0]:.1f}' for q in p) + 'Z')
    if parts: slabs.append({'k': k, 'd': ''.join(parts)})
# markers: small bright blobs in the pattern (squares, crosses). Ones outside the crop are wrapped
# into it horizontally; each is nudged (<= 60 px) to the nearest spot that sits on a single level.
markers = []
def ok(cx, cy, rad):
    y_a, y_b, x_a, x_b = int(cy - rad), int(cy + rad), int(cx - rad), int(cx + rad)
    if y_a < 6 or x_a < 6 or y_b > h - 6 or x_b > w - 6: return None
    if not (x_b < mx - 20 or x_a > mx + lw + 20 or y_b < ly0 - 20): return None   # keep off the logo
    for m in markers:                                                              # no crowding
        if abs(m['x'] - cx) < 50 and abs((h - m['y']) - cy) < 50: return None
    patch = r[y_a:y_b, x_a:x_b]
    return int(patch.min()) if patch.min() == patch.max() else None
if not no_markers:
    full = np.asarray(Image.open(img_path).convert('L')) > 135
    lab, n = ndi.label(full, structure=np.ones((3, 3)))
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        bh, bw = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if max(bh, bw) > 60 or min(bh, bw) < 8: continue
        fill = (lab[sl] == i).mean()
        kind = 'square' if fill > 0.6 else ('cross' if 0.15 < fill < 0.45 and abs(bh - bw) < 8 else None)
        if not kind: continue
        s_ = 14 if kind == 'square' else 40
        cy, cx = (sl[0].start + sl[0].stop) / 2, ((sl[1].start + sl[1].stop) / 2 - x0) % w
        rad = s_ / 2 + 8
        best = None
        for d in range(0, 61, 4):
            for dy in range(-d, d + 1, 4):
                for dx in (-d, d) if abs(dy) != d else range(-d, d + 1, 4):
                    k = ok(cx + dx, cy + dy, rad)
                    if k is not None: best = (cx + dx, cy + dy, k); break
                if best: break
            if best: break
        if best:
            markers.append({'type': kind, 'x': round(best[0], 1), 'y': round(h - best[1], 1), 's': s_, 'k': best[2]})
print('w', w, 'h', h, 'levels', kmin, '..', kmax, 'logo level', logo_k, 'markers', len(markers))
json.dump({'w': w, 'h': h, 'kmin': kmin, 'kmax': kmax, 'slabs': slabs, 'markers': markers,
           'logo': {'x': mx, 'y': my, 'w': lw, 'h': lh, 'k': logo_k}}, open(out, 'w'), separators=(',', ':'))
