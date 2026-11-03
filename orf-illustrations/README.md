# ORF illustrations

- `original/` – the SVGs as delivered (image trace: black lines are filled shapes).
- `stroke/` – centerline trace: every black line is a stroked path (`<g id="lines">`),
  every white area is its own filled path (`<g id="fills">`). Fills reach to the middle
  of the lines, so you can recolour them or change the stroke width without gaps.

Rebuild a stroke version (needs Node + Playwright, Python with numpy, scipy, scikit-image):

    node tools/render.js original/ORF-02.svg /tmp/ORF-02.png 12
    python3 tools/centerline.py /tmp/ORF-02.png 12 272.65 253.43 stroke/ORF-02.svg round

Use a scale that makes the render about 3000-3500 px wide (12 for the ~270-unit files, 4 for ORF-06).

The last argument is the line join: `round` for the characters, `miter` for the box (ORF-04).

Add `v2` as an eighth argument to keep solid black shapes (like the stars on ORF-07) as black
filled shapes, and to prune only the corner stubs of the trace instead of every short line end.
ORF-07 to ORF-09 were traced with `v2` (ORF-09 with `miter` joins); ORF-02 to ORF-06 without it.

## Pictures (PNG, JPG, WebP)

ORF-10 to ORF-12 came in as WebP pictures. `tools/prep.py` turns a black-on-white picture into
the transparent black/white image the tracer expects (it enlarges it, smooths compression noise and
removes the white around the drawing). Then trace with `v3`, which also keeps every part of the
black that is much thicker than a line (letters, shadows) as a solid black shape on top:

    python3 tools/prep.py original/ORF-11.webp /tmp/ORF-11.png 2
    python3 tools/centerline.py /tmp/ORF-11.png 2 1754 1280 stroke/ORF-11.svg round v3

For a picture the scale is the enlargement factor and the size is the picture's own size in pixels.
