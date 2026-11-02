import os, sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from collections import deque
img = np.asarray(Image.open(sys.argv[1]).convert('L')).astype(float)
H, W = img.shape
os.makedirs(sys.argv[2], exist_ok=True)
print('size', W, H, 'bg median', np.median(img))
line = img > 135                      # solid contour lines (dashed lines / bg are darker)
# drop small blobs: squares, crosses, specks (lines are long)
lab, n = ndi.label(line, structure=np.ones((3,3)))
sl = ndi.find_objects(lab)
keep = np.zeros(n+1, bool)
for i, s in enumerate(sl, 1):
    h, w = s[0].stop - s[0].start, s[1].stop - s[1].start
    keep[i] = max(h, w) > 60
line = keep[lab]
line = ndi.binary_dilation(line, iterations=1)   # close hairline gaps
reg, nr = ndi.label(~line)
sizes = ndi.sum(np.ones_like(reg), reg, range(nr+1))
print('regions', nr, 'big', (sizes > 200).sum())
# assign every pixel (lines + tiny regions) to nearest big region
big = sizes > 200; big[0] = False
mask = big[reg]
_, (iy, ix) = ndi.distance_transform_edt(~mask, return_indices=True)
full = reg[iy, ix]
# adjacency between regions (4-neighbour changes in the filled map)
adj = {}
for a, b in [(full[:, :-1], full[:, 1:]), (full[:-1, :], full[1:, :])]:
    d = a != b
    for u, v in set(zip(a[d].tolist(), b[d].tolist())):
        adj.setdefault(u, set()).add(v); adj.setdefault(v, set()).add(u)
seeds = [(0,0),(0,W-1),(H-1,0),(H-1,W-1)] if len(sys.argv) < 4 else [tuple(map(int,p.split(','))) for p in sys.argv[3].split(';')]
border = set(int(full[y,x]) for y,x in seeds)
print('seed regions', border)
depth = {r: 0 for r in border}
q = deque(border)
while q:
    u = q.popleft()
    for v in adj.get(u, ()):
        if v not in depth:
            depth[v] = depth[u] + 1; q.append(v)
lut = np.zeros(full.max()+1, int)
for r, d in depth.items(): lut[r] = d
D = lut[full]
print('max depth', D.max(), 'hist', np.bincount(D.ravel()).tolist())
np.save(sys.argv[2] + '/depth.npy', D); np.save(sys.argv[2] + '/regions.npy', full)
vis = (D / max(D.max(), 1) * 255).astype(np.uint8)
Image.fromarray(vis).save(sys.argv[2] + '/depth.png')
Image.fromarray((line*255).astype(np.uint8)).save(sys.argv[2] + '/lines.png')
