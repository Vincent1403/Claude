"""Centerline trace: black ink -> stroked paths, white areas -> filled paths.
usage: python3 centerline.py in.png scale viewbox_w viewbox_h out.svg"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize, remove_small_objects, remove_small_holes
from skimage import measure

png, S, VW, VH, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
JOIN = sys.argv[6] if len(sys.argv) > 6 else 'round'
V2 = len(sys.argv) > 7 and sys.argv[7] in ('v2', 'v3')   # solid black shapes kept as fills, smarter spur pruning
V3 = len(sys.argv) > 7 and sys.argv[7] == 'v3'           # also: every thick black part becomes a solid shape, drawn on top
im = np.array(Image.open(png).convert('RGBA')).astype(float) / 255
a = im[..., 3]; lum = im[..., :3] @ [.299, .587, .114]
black = (a > .5) & (lum < .5)
white = (a > .5) & (lum >= .5)
black = remove_small_objects(black, 30)
black = remove_small_holes(black, 60)
solids = []
if V2:
    from skimage.morphology import convex_hull_image
    d0 = ndi.distance_transform_edt(black); s0 = skeletonize(black)
    hw = np.median(d0[s0])                     # typical half line width (px)
    bl, nb_ = ndi.label(black, structure=np.ones((3, 3)))
    for i, sl_ in enumerate(ndi.find_objects(bl), 1):
        m = bl[sl_] == i
        h_, w_ = m.shape
        if max(h_, w_) > 10 * hw or min(h_, w_) / max(h_, w_) < 0.45: continue
        if d0[sl_][m].max() < 1.25 * hw: continue          # plain dash, keep as a stroke
        if ndi.label(~np.pad(m, 1))[1] > 1: continue        # has a hole: it is an outline
        if m.sum() / convex_hull_image(m).sum() < 0.4: continue
        solids.append((sl_, m)); black[sl_][m] = False
solidmask = np.zeros_like(black)
if V3:
    for sl_, m in solids: solidmask[sl_] |= m
    solids = []
    r_ = 1.4 * hw
    core = ndi.distance_transform_edt(black) > r_
    opened = ndi.distance_transform_edt(~core) <= r_                 # morphological opening: parts thicker than ~2.8 half widths
    near = ndi.distance_transform_edt(~opened) <= 0.6 * hw
    solidmask |= black & near
    solidmask = remove_small_objects(solidmask, int(40 * hw * hw))       # smaller blobs are just thick line corners
    black &= ~solidmask
    black = remove_small_objects(black, int(3 * hw * hw))            # slivers left at the corners of solid shapes
dist = ndi.distance_transform_edt(black)
sk = skeletonize(black)
H, W = sk.shape
K = np.ones((3, 3)); K[1, 1] = 0
nb = ndi.convolve(sk.astype(int), K, mode='constant') * sk
nodemask = sk & (nb != 2)
lab, nlab = ndi.label(nodemask, structure=np.ones((3, 3)))
centers = ndi.center_of_mass(nodemask, lab, range(1, nlab + 1))
pos = {i + 1: np.array(c)[::-1] for i, c in enumerate(centers)}   # (x,y)
OFF = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
def nbrs(y, x):
    for dy, dx in OFF:
        yy, xx = y + dy, x + dx
        if 0 <= yy < H and 0 <= xx < W and sk[yy, xx]:
            yield yy, xx
visited = np.zeros_like(sk)
edges = []   # [u, v, pts(list of (x,y))]
direct = set()
for y, x in zip(*np.nonzero(nodemask)):
    L = lab[y, x]
    for q in nbrs(y, x):
        M = lab[q]
        if M == L: continue
        if M > 0:
            k = (min(L, M), max(L, M))
            if k not in direct:
                direct.add(k); edges.append([L, M, [pos[L], pos[M]]])
            continue
        if visited[q]: continue
        path = [(x, y), (q[1], q[0])]; visited[q] = True
        prev, cur = (y, x), q; end = None
        while True:
            nxt = None
            for r in nbrs(*cur):
                if r == prev: continue
                if lab[r] == L and len(path) <= 2: continue
                nxt = r; break
            if nxt is None: break
            path.append((nxt[1], nxt[0]))
            if lab[nxt] > 0: end = lab[nxt]; break
            visited[nxt] = True; prev, cur = cur, nxt
        if end is None: continue
        pts = [pos[L]] + [np.array(p, float) for p in path[1:-1]] + [pos[end]]
        edges.append([L, end, pts])
# pure loops (no nodes)
loops = []
rem = sk & (nb == 2) & ~visited
for y, x in zip(*np.nonzero(rem)):
    if visited[y, x]: continue
    path = [(x, y)]; visited[y, x] = True; prev, cur = None, (y, x)
    while True:
        nxt = None
        for r in nbrs(*cur):
            if r != prev and not visited[r]: nxt = r; break
        if nxt is None: break
        visited[nxt] = True; path.append((nxt[1], nxt[0])); prev, cur = cur, nxt
    if len(path) > 8: loops.append(np.array(path, float))

def plen(p): p = np.asarray(p); return np.sum(np.hypot(*np.diff(p, axis=0).T)) if len(p) > 1 else 0
def width_at(p):
    p = np.asarray(p).round().astype(int)
    d = dist[np.clip(p[:, 1], 0, H - 1), np.clip(p[:, 0], 0, W - 1)]
    return d
# graph cleanup: prune short spurs, merge degree-2 nodes
for _ in range(4):
    deg = {}
    for u, v, _p in edges:
        deg[u] = deg.get(u, 0) + 1; deg[v] = deg.get(v, 0) + 1
    keep = []
    for e in edges:
        u, v, p = e
        if u != v and (deg[u] == 1) != (deg[v] == 1):
            j = v if deg[u] == 1 else u
            wj = 2 * dist[int(round(pos[j][1])), int(round(pos[j][0]))]
            if V2:
                k = u if deg[u] == 1 else v
                tip = dist[int(round(pos[k][1])), int(round(pos[k][0]))]
                if plen(p) < 2.0 * wj and tip < 0.3 * wj: continue   # corner stub: tip runs into the edge
                if plen(p) < 0.6 * wj: continue
            elif plen(p) < 1.6 * wj: continue
        keep.append(e)
    edges = keep
    changed = True
    while changed:
        changed = False
        inc = {}
        for i, (u, v, p) in enumerate(edges):
            inc.setdefault(u, []).append(i)
            if v != u: inc.setdefault(v, []).append(i)
            else: inc[u].append(i)
        for n, ii in inc.items():
            if len(ii) == 2 and ii[0] != ii[1]:
                e1, e2 = edges[ii[0]], edges[ii[1]]
                p1 = e1[2] if e1[1] == n else e1[2][::-1]; a_ = e1[0] if e1[1] == n else e1[1]
                p2 = e2[2] if e2[0] == n else e2[2][::-1]; b_ = e2[1] if e2[0] == n else e2[0]
                new = [a_, b_, list(p1) + list(p2[1:])]
                edges = [e for k, e in enumerate(edges) if k not in ii] + [new]
                changed = True; break

def smooth(p, closed, sig=2.5):
    p = np.asarray(p, float)
    if len(p) < 5: return p
    mode = 'wrap' if closed else 'nearest'
    q = np.stack([ndi.gaussian_filter1d(p[:, i], sig, mode=mode) for i in range(2)], 1)
    if not closed: q[0], q[-1] = p[0], p[-1]
    return q
def rdp(p, eps):
    p = np.asarray(p)
    if len(p) < 3: return p
    a_, b_ = p[0], p[-1]; d = b_ - a_; n = np.hypot(*d)
    if n == 0: dd = np.hypot(*(p - a_).T)
    else: dd = np.abs(d[0] * (p[:, 1] - a_[1]) - d[1] * (p[:, 0] - a_[0])) / n
    i = int(np.argmax(dd))
    if dd[i] > eps: return np.vstack([rdp(p[:i + 1], eps)[:-1], rdp(p[i:], eps)])
    return np.array([a_, b_])
U = lambda v: (v + 0.5) / S
def f(v): s = f'{v:.2f}'.rstrip('0').rstrip('.'); return s if s not in ('-0', '') else '0'
def bez(p, closed):
    p = np.asarray(p, float)
    if closed:
        if np.allclose(p[0], p[-1]): p = p[:-1]
    n = len(p)
    if n < 2: return ''
    def turn(i):
        if not closed and (i == 0 or i == n - 1): return False
        a1 = p[i] - p[i - 1]; a2 = p[(i + 1) % n] - p[i]
        c = a1 @ a2 / (np.hypot(*a1) * np.hypot(*a2) + 1e-9)
        return c < np.cos(np.radians(62))
    corner = [turn(i) for i in range(n)]
    def tan(i):
        if corner[i]: return np.zeros(2)
        d = (p[(i + 1) % n] - p[i - 1]) if closed else (p[min(i + 1, n - 1)] - p[max(i - 1, 0)])
        return d / (np.hypot(*d) + 1e-9)
    P = lambda v: f'{f(U(v[0]))},{f(U(v[1]))}'
    s = 'M' + P(p[0])
    segs = n if closed else n - 1
    for i in range(segs):
        j = (i + 1) % n
        seg = np.hypot(*(p[j] - p[i])) / 3
        c1 = p[i] + tan(i) * seg; c2 = p[j] - tan(j) * seg
        s += 'C' + P(c1) + ' ' + P(c2) + ' ' + P(p[j])
    return s + ('Z' if closed else '')

# ---- strokes
strokes = []
for u, v, p in edges:
    p = np.asarray(p, float)
    L = plen(p)
    if L < 2: continue
    closed = (u == v)
    d = width_at(p); core = d[len(d) // 5: max(len(d) * 4 // 5, len(d) // 5 + 1)]
    w = (2 * np.median(core) - 1) / S
    q = rdp(smooth(p, closed), 1.0)
    strokes.append((w, bez(q, closed), L))
for p in loops:
    d = width_at(p); w = (2 * np.median(d) - 1) / S
    q = rdp(smooth(np.vstack([p, p[:1]]), True), 1.0)
    strokes.append((w, bez(q, True), plen(p)))
ws = np.array([s[0] for s in strokes]); lens = np.array([s[2] for s in strokes])
wmed = float(np.average(ws, weights=lens))

# ---- fills
white = remove_small_objects(white, 40)
wl, nw = ndi.label(white)
area = ndi.sum(white, wl, range(1, nw + 1))
keep = np.concatenate([[False], area >= 60])
wl = np.where(keep[wl], wl, 0)
# every pixel inside the drawing goes to its nearest white area (the transparent outside is one more
# "area"), so neighbouring fills meet in the middle of each line, however thick the black is there
BG = nw + 1
outside = remove_small_objects(a <= .5, 200)   # ignore see-through specks where two black shapes of the original meet
lab0 = wl.copy(); lab0[outside] = BG
SOLID = nw + 2
if V3: lab0[solidmask & ~outside] = SOLID
iy, ix = ndi.distance_transform_edt(lab0 == 0, return_distances=False, return_indices=True)
owner = lab0[iy, ix]; del iy, ix
fills = []
sl = ndi.find_objects(owner)
for i, s_ in enumerate(sl, 1):
    if s_ is None or i > nw or not keep[i]: continue
    y0, y1 = s_[0].start, s_[0].stop
    x0, x1 = s_[1].start, s_[1].stop
    m = wl[y0:y1, x0:x1] == i
    y0, y1, x0, x1 = max(y0 - 5, 0), min(y1 + 5, H), max(x0 - 5, 0), min(x1 + 5, W)
    m = wl[y0:y1, x0:x1] == i
    own = owner[y0:y1, x0:x1]
    # overlap neighbouring fills by 4 px so no hairline seam opens between them (never into the outside)
    grown = np.pad(ndi.binary_dilation(own == i, iterations=4) & (own != BG), 1)
    cs = measure.find_contours(grown.astype(float), 0.5)
    d = ''
    for c in cs:
        if len(c) < 8: continue
        pts = np.stack([c[:, 1] + x0 - 1, c[:, 0] + y0 - 1], 1)
        q = rdp(smooth(pts, True, 0.8), 1.5)
        if len(q) >= 4:
            q = q[:-1] if np.allclose(q[0], q[-1]) else q
            d += 'M' + 'L'.join(f'{f(U(x))},{f(U(y))}' for x, y in q) + 'Z'
    if d: fills.append((m.sum(), d))
for sl_, m in solids:
    y0, x0 = sl_[0].start, sl_[1].start
    for c in measure.find_contours(np.pad(m, 1).astype(float), 0.5):
        pts = np.stack([c[:, 1] + x0 - 1, c[:, 0] + y0 - 1], 1)
        q = rdp(smooth(pts, True, 0.8), 0.8)
        if len(q) >= 4:
            q = q[:-1] if np.allclose(q[0], q[-1]) else q
            fills.append((m.sum(), 'M' + 'L'.join(f'{f(U(x))},{f(U(y))}' for x, y in q) + 'Z', '#000'))
fills = [t if len(t) == 3 else (t[0], t[1], '#fff') for t in fills]
fills.sort(key=lambda t: -t[0])
if V3:   # solid shapes go last, on top of the white areas, largest first
    sl2, ns = ndi.label(solidmask)
    tops = []
    for i, s_ in enumerate(ndi.find_objects(sl2), 1):
        m = np.pad(sl2[s_] == i, 1); y0, x0 = s_[0].start, s_[1].start
        d = ''
        for c in measure.find_contours(m.astype(float), 0.5):
            pts = np.stack([c[:, 1] + x0 - 1, c[:, 0] + y0 - 1], 1)
            q = rdp(smooth(pts, True, 1.2), 0.9)
            if len(q) >= 4:
                q = q[:-1] if np.allclose(q[0], q[-1]) else q
                d += 'M' + 'L'.join(f'{f(U(x))},{f(U(y))}' for x, y in q) + 'Z'
        if d: tops.append((int(m.sum()), d, '#000'))
    tops.sort(key=lambda t: -t[0]); fills += tops; solids = tops

# ---- write
rnd = lambda w: f(round(w * 20) / 20)
out_s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(VW)} {f(VH)}">',
         '  <g id="fills" fill="#fff" fill-rule="evenodd">']
out_s += [f'    <path d="{d}"/>' if c == '#fff' else f'    <path fill="{c}" d="{d}"/>' for _, d, c in fills]
out_s += ['  </g>', f'  <g id="lines" fill="none" stroke="#000" stroke-width="{rnd(wmed)}" stroke-linecap="round" stroke-linejoin="{JOIN}">']
for w, d, _ in strokes:
    attr = '' if rnd(w) == rnd(wmed) else f' stroke-width="{rnd(w)}"'
    out_s.append(f'    <path d="{d}"{attr}/>')
out_s += ['  </g>', '</svg>']
open(out, 'w').write('\n'.join(out_s) + '\n')
print(f'{out}: {len(fills)} fills ({len(solids)} solid), {len(strokes)} strokes, base width {wmed:.2f}, widths {np.percentile(ws,[5,25,50,75,95]).round(2)}')
