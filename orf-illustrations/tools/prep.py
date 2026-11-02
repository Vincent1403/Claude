"""Turn a black-on-white picture (png/jpg/webp) into the RGBA image centerline.py expects:
black ink, white areas, transparent outside.  usage: python3 prep.py in.img out.png scale"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import remove_small_objects, remove_small_holes
src, out, S = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = Image.open(src).convert('L')
im = im.resize((round(im.width * S), round(im.height * S)), Image.LANCZOS)
g = ndi.gaussian_filter(np.asarray(im, float) / 255, 0.6 * S)        # soften compression noise
ink = remove_small_holes(remove_small_objects(g < 0.5, int(30 * S * S)), int(30 * S * S))
lab, n = ndi.label(~ink)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
outside = np.isin(lab, list(border))
rgba = np.zeros(ink.shape + (4,), np.uint8)
rgba[~outside] = (255, 255, 255, 255); rgba[ink] = (0, 0, 0, 255)
Image.fromarray(rgba).save(out)
print(out, rgba.shape[1], 'x', rgba.shape[0])
