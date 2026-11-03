"""Turn a black-line picture (png/jpg/webp) into the RGBA image centerline.py expects:
black ink, white areas, transparent outside.

usage: python3 prep.py in.img out.png scale [grid]

Ink is anything dark in all three colour channels, so coloured parts (a gradient panel, a pink
needle, blue grid lines) are never taken for lines. Everything not ink that touches the edge of the
picture is outside. With `grid`, an enclosed area that shows blue grid lines (such as the opening
under a handle) is outside too, for drawings on grid paper whose paper colour matches the drawing.
"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import remove_small_objects, remove_small_holes
src, out, S = sys.argv[1], sys.argv[2], float(sys.argv[3])
GRID = len(sys.argv) > 4 and sys.argv[4] == 'grid'
im = Image.open(src).convert('RGB')
im = im.resize((round(im.width * S), round(im.height * S)), Image.LANCZOS)
rgb = np.asarray(im, float) / 255
dark = ndi.gaussian_filter(rgb.max(axis=2), 0.6 * S)        # brightest channel: low only for black/grey
ink = remove_small_holes(remove_small_objects(dark < 0.45, int(30 * S * S)), int(30 * S * S))
lab, n = ndi.label(~ink)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
if GRID:
    blue = (rgb[..., 2] - np.maximum(rgb[..., 0], rgb[..., 1]) > 0.25) & ~ink
    counts = ndi.sum(blue, lab, range(1, n + 1))
    border |= {i + 1 for i, c in enumerate(counts) if c > 40 * S * S}
outside = np.isin(lab, list(border))
rgba = np.zeros(ink.shape + (4,), np.uint8)
rgba[~outside] = (255, 255, 255, 255); rgba[ink] = (0, 0, 0, 255)
Image.fromarray(rgba).save(out)
print(out, rgba.shape[1], 'x', rgba.shape[0])
