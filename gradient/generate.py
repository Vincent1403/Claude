"""Render the warm orange -> raspberry gradient as a dithered PNG.

Direction matches CSS `linear-gradient(to bottom right, ...)`: isolines run
parallel to the top-right/bottom-left diagonal, so t = (x/W + y/H) / 2.
Usage: python3 generate.py [width] [height] [out.png]
"""
import sys
import numpy as np
from PIL import Image

STOPS = [
    (0.00, "#FFA238"),  # light peach-orange
    (0.30, "#FF790E"),  # vivid warm orange
    (0.55, "#FF4C08"),  # saturated orange-red
    (0.75, "#E82A0D"),  # deep warm red
    (0.90, "#C90032"),  # crimson red
    (1.00, "#A90043"),  # raspberry-magenta
]

def hex_rgb(h):
    return [int(h[i:i + 2], 16) for i in (1, 3, 5)]

def render(w, h):
    x = np.linspace(0, 1, w, dtype=np.float64)[None, :]
    y = np.linspace(0, 1, h, dtype=np.float64)[:, None]
    t = (x + y) / 2  # 0 at top-left, 1 at bottom-right

    pos = np.array([s[0] for s in STOPS])
    cols = np.array([hex_rgb(s[1]) for s in STOPS], dtype=np.float64)
    # sRGB interpolation, same as the CSS default, so PNG and CSS match
    img = np.stack([np.interp(t, pos, cols[:, c]) for c in range(3)], axis=-1)

    # Triangular (TPDF) dither of +/-1 LSB hides 8-bit banding
    rng = np.random.default_rng(0)
    img += rng.random(img.shape) - rng.random(img.shape)
    return Image.fromarray(np.clip(np.round(img), 0, 255).astype(np.uint8), "RGB")

if __name__ == "__main__":
    w = int(sys.argv[1]) if len(sys.argv) > 1 else 3840
    h = int(sys.argv[2]) if len(sys.argv) > 2 else 2160
    out = sys.argv[3] if len(sys.argv) > 3 else f"gradient-{w}x{h}.png"
    render(w, h).save(out, optimize=True)
    print(out)
