"""raw_<key>.png cells -> one transparent sprite sheet (order in ORDER)."""
import sys, numpy as np
from PIL import Image
from collections import deque

def label(mask):
    lab = np.zeros(mask.shape, int); n = 0; h, w = mask.shape
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

def grow(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1): out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out

GAP, LEG_GAP, LEG_Y = 4, 12, 190  # outline openings closed up to ~2*gap px; legs fade out more
ORDER = ['f0', 'r0', 'r1', 'r2', 'r3', 'r4', 'l0', 'l1', 'l2', 'l3', 'l4']
cells = []
for k in ORDER:
    a = np.asarray(Image.open(f'raw_{k}.png')).astype(np.uint8).copy()
    if k == 'f0':
        a[290:, :80] = 255                       # drop the "FRONT / 1 FRAME" label
    white = a.min(2) > 225
    # background = white reachable from the cell edge once the outlines are thickened,
    # grown back to the original outline afterwards
    legs = np.zeros(white.shape, bool); legs[LEG_Y:] = True
    walls = grow(~white, GAP) | (grow(~white, LEG_GAP) & legs)
    olab, _ = label(~walls)
    edge = set(np.unique(np.concatenate([olab[0], olab[-1], olab[:,0], olab[:,-1]]))) - {0}
    bg = np.isin(olab, list(edge))
    clear = (grow(bg, GAP) | (grow(bg, LEG_GAP) & legs)) & white
    lab, n = label(white & ~clear)
    red = (a[:,:,0] > 170) & (a[:,:,1] < 110) & (a[:,:,2] < 110)
    border = set()
    for c in range(1, n + 1):
        if c in border: continue
        m = lab == c
        if m.sum() < 1000: continue
        ring = np.zeros_like(m)
        for dy in range(-3, 4):
            for dx in range(-3, 4): ring |= np.roll(np.roll(m, dy, 0), dx, 1)
        ring &= ~m
        if red[ring].mean() >= 0.13: clear |= m   # gap between the raised arms
    alpha = np.where(clear, 0, 255).astype(np.uint8)
    cells.append(np.dstack([a, alpha]))
sheet = np.concatenate(cells, 1)
Image.fromarray(sheet, 'RGBA').save(sys.argv[1], 'WEBP', quality=88, method=6)
Image.fromarray(sheet, 'RGBA').save(sys.argv[1].replace('.webp', '_check.png'))
