# Set text in a font (with its kerning) and write it as outlined SVG paths.
#   python text2svg.py FONT.otf OUT.svg "LINE 1" "LINE 2" ... [--align center|left] [--leading 1.15]
# Coordinates are font units (1 em = unitsPerEm), y down; lines are aligned and stacked.
import sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
args = sys.argv[1:]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return default
align, leading = opt('--align', 'center'), float(opt('--leading', '1.15'))
font_path, out, lines = args[0], args[1], args[2:]
font = TTFont(font_path); glyphs = font.getGlyphSet(); upm = font['head'].unitsPerEm
cap = font['OS/2'].sCapHeight or 0.7 * upm
blob = hb.Blob.from_file_path(font_path); hbfont = hb.Font(hb.Face(blob))
order = font.getGlyphOrder()
def shape(text):
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hbfont, buf, {'kern': True, 'liga': True})
    return buf.glyph_infos, buf.glyph_positions
shaped = [shape(t) for t in lines]
widths = [sum(p.x_advance for p in pos) for _, pos in shaped]
W = max(widths)
paths = []
for n, ((infos, pos), w) in enumerate(zip(shaped, widths)):
    x = (W - w) / 2 if align == 'center' else 0
    base = cap + n * leading * upm                      # baseline of line n (y down)
    for info, p in zip(infos, pos):
        pen = SVGPathPen(glyphs)
        # font units are y up: flip, and move the glyph to its place on the line
        glyphs[order[info.codepoint]].draw(TransformPen(pen, (1, 0, 0, -1, x + p.x_offset, base - p.y_offset)))
        if pen.getCommands(): paths.append(pen.getCommands())
        x += p.x_advance
H = cap + (len(lines) - 1) * leading * upm
with open(out, 'w') as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H:.0f}">\n'
            f'<!-- {" / ".join(lines)} - outlined from {font["name"].getDebugName(4)} -->\n'
            f'<path fill-rule="evenodd" d="{"".join(paths)}"/>\n</svg>\n')
print(out, 'width', W, 'height', round(H), 'aspect', round(W / H, 3))
