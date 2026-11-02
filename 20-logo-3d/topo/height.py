# Elevation from the contour bands: closed nests are hills (inner = higher), and the
# terrain falls one level per line crossed going away from the summits.
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from collections import deque
out = sys.argv[1]
full = np.load(out + '/regions.npy'); H, W = full.shape
adj = {}
for a, b in [(full[:, :-1], full[:, 1:]), (full[:-1, :], full[1:, :])]:
    d = a != b
    for u, v in set(zip(a[d].tolist(), b[d].tolist())):
        adj.setdefault(u, set()).add(v); adj.setdefault(v, set()).add(u)
def bfs(seeds):
    dist = {r: 0 for r in seeds}; q = deque(seeds)
    while q:
        u = q.popleft()
        for v in adj.get(u, ()):
            if v not in dist: dist[v] = dist[u] + 1; q.append(v)
    return dist
border = set(np.unique(np.concatenate([full[0], full[-1], full[:, 0], full[:, -1]])).tolist())
nest = bfs(border)                                   # nesting depth of closed loops
peaks = [r for r in nest if nest[r] > 0 and all(nest[v] < nest[r] for v in adj[r])]
print('peaks', [(r, nest[r]) for r in peaks])
E = {r: -10**9 for r in nest}
for p in peaks:
    d = bfs([p])
    for r in E: E[r] = max(E[r], nest[p] - d.get(r, 10**6))
lut = np.zeros(full.max() + 1, int)
for r, e in E.items(): lut[r] = e
Z = lut[full]
np.save(out + '/elev.npy', Z)
print('elev range', Z.min(), Z.max())
v = ((Z - Z.min()) / (Z.max() - Z.min()) * 255).astype(np.uint8)
Image.fromarray(v).save(out + '/elev.png')
