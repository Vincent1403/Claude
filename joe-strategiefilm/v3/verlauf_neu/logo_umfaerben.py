"""Färbt die jö-Logos mit eingebranntem Rot-Orange-Verlauf (weißer Kreis + Verlaufs-Glyphe) auf den neuen Verlauf um.
Neuer Verlauf: linear-gradient(to bottom left, #FFA238 0%, #FF790E 30%, #FF4C08 55%, #E82A0D 75%, #C90032 90%, #A90043 100%)
über die Bounding-Box der Glyphe. Form/Kanten: Kern = volle Deckung, Kantenpixel anteilig (gegen Weiß gemischt)."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
STOPS = [(0, '#FFA238'), (30, '#FF790E'), (55, '#FF4C08'), (75, '#E82A0D'), (90, '#C90032'), (100, '#A90043')]
def hx(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float)
def grad(t):
    P = np.array([s[0] / 100 for s in STOPS]); C = np.array([hx(s[1]) for s in STOPS])
    return np.stack([np.interp(t, P, C[:, k]) for k in range(3)], -1)
def recolor(src, dst, xmax=None):
    v = np.asarray(Image.open(src).convert('RGBA'), float); rgb, A = v[..., :3], v[..., 3]
    d = 255 - rgb.min(-1) * 0 - rgb[..., 1:3].mean(-1)            # Abstand zu Weiß über G und B (R ist in der Glyphe fast immer 255)
    M = (d > 25) & (A > 200)          # Kreisrand (halbtransparent) gehört nicht zur Glyphe
    if xmax: M[:, xmax:] = False                                    # nur das jö-Icon, nicht der dunkelrote Schriftzug
    lab, n = nd.label(M); sz = nd.sum(M, lab, range(1, n + 1))
    M = np.isin(lab, 1 + np.where(sz > 300)[0])                    # Streupixel am Kreisrand weg (sonst stimmt die Verlaufs-Box nicht)
    core = nd.binary_erosion(M, iterations=2)
    # Kernwert von d für Kantenpixel: nächster Kernpixel
    idx = nd.distance_transform_edt(~core, return_distances=False, return_indices=True)
    dcore = d[idx[0], idx[1]]
    a = np.where(core, 1.0, np.clip(d / np.maximum(dcore, 1), 0, 1)) * (d > 6)
    a *= nd.binary_dilation(M, iterations=3)                         # nur Glyphe + ihre Kante
    ys, xs = np.where(M); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max(); w, h = x1 - x0, y1 - y0
    H, W = A.shape; yy, xx = np.mgrid[0:H, 0:W]
    t = np.clip(((x1 - xx) * h + (yy - y0) * w) / (2 * w * h), 0, 1)   # CSS „to bottom left“ (Kunde: gespiegelt – hell oben rechts, dunkel unten links)
    g = grad(t)
    out = rgb.copy(); sel = a > 0
    out[sel] = (255 * (1 - a[sel, None]) + g[sel] * a[sel, None])
    Image.fromarray(np.dstack([np.clip(out, 0, 255), A]).astype('uint8'), 'RGBA').save(dst, 'WEBP', quality=92)
if __name__ == '__main__':
    for s_, d_, xm in (('endc_icon_verlauf.webp', 'verlauf_neu/endc_icon_verlauf_neu.webp', None), ('jo_verlauf.webp', 'verlauf_neu/jo_verlauf_neu.webp', None),
                       ('partner_logos/josport_weiss.webp', 'verlauf_neu/josport_weiss_neu.webp', 280), ('partner_logos/joreisen_weiss.webp', 'verlauf_neu/joreisen_weiss_neu.webp', 280)):
        recolor(s_, d_, xm); print('ok', d_)
