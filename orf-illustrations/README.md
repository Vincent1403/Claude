# ORF illustrations

- `original/` – the SVGs as delivered (image trace: black lines are filled shapes).
- `stroke/` – centerline trace: every black line is a stroked path (`<g id="lines">`),
  every white area is its own filled path (`<g id="fills">`). Fills reach to the middle
  of the lines, so you can recolour them or change the stroke width without gaps.

Rebuild a stroke version (needs Node + Playwright, Python with numpy, scipy, scikit-image):

    node tools/render.js original/ORF-02.svg /tmp/ORF-02.png 12
    python3 tools/centerline.py /tmp/ORF-02.png 12 272.65 253.43 stroke/ORF-02.svg round

The last argument is the line join: `round` for the characters, `miter` for the box (ORF-04).
