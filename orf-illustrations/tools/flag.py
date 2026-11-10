"""Draw a waving Austrian flag on a pole as a stroke + fill SVG in the same structure as the traced
files: <g id="fills"> (one white path per paintable area) and <g id="lines"> (black strokes).
Fills and lines are built from the same curves, so every fill reaches the middle of its outline."""
import math

W, H = 300, 270
X0, LEN, SLANT = 64.0, 196.0, 12.0          # flag starts at the pole, runs LEN to the right


def top_y(t):  return 46 + 13 * math.sin(math.pi * 1.7 * t) - 8 * t
def bot_y(t):  return 154 + 13 * math.sin(math.pi * 1.7 * t - 0.55) - 4 * t


def P(t, s):
    """Point on the flag: t along its length (0 at the pole), s across it (0 top, 1 bottom)."""
    y0, y1 = top_y(t), bot_y(t)
    return (X0 + LEN * t + SLANT * s * t, y0 + (y1 - y0) * s)


def f(v): return f'{v:.2f}'.rstrip('0').rstrip('.')


def curve(pts, start=True):
    """Smooth curve through pts (Catmull-Rom, handles sized to each segment)."""
    out = f'M{f(pts[0][0])},{f(pts[0][1])}' if start else ''
    n = len(pts)
    def tan(i):
        a, b = pts[max(i - 1, 0)], pts[min(i + 1, n - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]; d = math.hypot(dx, dy) or 1
        return dx / d, dy / d
    for i in range(n - 1):
        p, q = pts[i], pts[i + 1]
        seg = math.hypot(q[0] - p[0], q[1] - p[1]) / 3
        t1, t2 = tan(i), tan(i + 1)
        c1 = (p[0] + t1[0] * seg, p[1] + t1[1] * seg); c2 = (q[0] - t2[0] * seg, q[1] - t2[1] * seg)
        out += f'C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(q[0])},{f(q[1])}'
    return out


N = 10
along = lambda s, rev=False: [P(i / N, s) for i in (range(N, -1, -1) if rev else range(N + 1))]
line = lambda t, s0, s1: f'L{f(P(t, s1)[0])},{f(P(t, s1)[1])}'        # straight edge at the pole / tip


def band(s0, s1):
    d = curve(along(s0))                      # upper edge, pole -> tip
    d += line(1, s0, s1)                      # down the tip
    d += curve(along(s1, rev=True), start=False)   # lower edge, tip -> pole
    return d + 'Z'


# pole and ball
PX0, PX1, PY0, PY1 = 50.0, 62.0, 34.0, 252.0
pole = (f'M{f(PX0)},{f(PY0)}L{f(PX1)},{f(PY0)}L{f(PX1)},{f(PY1 - 6)}'
        f'C{f(PX1)},{f(PY1 - 2.7)} {f(PX1 - 2.7)},{f(PY1)} {f(PX1 - 6)},{f(PY1)}'
        f'C{f(PX0 + 2.7)},{f(PY1)} {f(PX0)},{f(PY1 - 2.7)} {f(PX0)},{f(PY1 - 6)}Z')
CX, CY, R = 56.0, 25.0, 10.0
k = 0.5523 * R
ball = (f'M{f(CX)},{f(CY - R)}C{f(CX + k)},{f(CY - R)} {f(CX + R)},{f(CY - k)} {f(CX + R)},{f(CY)}'
        f'C{f(CX + R)},{f(CY + k)} {f(CX + k)},{f(CY + R)} {f(CX)},{f(CY + R)}'
        f'C{f(CX - k)},{f(CY + R)} {f(CX - R)},{f(CY + k)} {f(CX - R)},{f(CY)}'
        f'C{f(CX - R)},{f(CY - k)} {f(CX - k)},{f(CY - R)} {f(CX)},{f(CY - R)}Z')

# folded corner: the bottom corner at the tip turns over along the line A-B and shows the back
TA, SB = 0.88, 0.8
A, B, C = P(TA, 1), P(1, SB), P(1, 1)
ax, ay = A; bx, by = B; dx, dy = bx - ax, by - ay
u = ((C[0] - ax) * dx + (C[1] - ay) * dy) / (dx * dx + dy * dy)
foot = (ax + u * dx, ay + u * dy)
C2 = (2 * foot[0] - C[0], 2 * foot[1] - C[1])                     # the corner mirrored over the fold
pt = lambda p: f'{f(p[0])},{f(p[1])}'
Mi = 10
bottom_to_A = [P(TA * i / Mi, 1) for i in range(Mi, -1, -1)]      # bottom edge from A back to the pole


def cut_band(s0):
    d = curve(along(s0))                                          # upper edge, pole -> tip
    d += f'L{pt(B)}L{pt(A)}'                                      # down the tip to the fold, along the fold
    d += curve(bottom_to_A, start=False)                          # bottom edge back to the pole
    return d + 'Z'


# the flap bulges a little, like cloth, instead of being a flat triangle
mid = ((A[0] + C2[0]) / 2 - 2, (A[1] + C2[1]) / 2 + 2)
flap = f'M{pt(A)}L{pt(B)}' + curve([B, C2], start=False) + curve([C2, mid, A], start=False) + 'Z'

fills = [band(0, 1 / 3), band(1 / 3, 2 / 3), cut_band(2 / 3), pole, ball, flap]
lines = [cut_band(0),                                 # flag outline with the corner turned over
         curve(along(1 / 3)), curve(along(2 / 3)),    # the two band edges
         pole, ball, flap]

svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">',
       '  <g id="fills" fill="#fff" fill-rule="evenodd">']
svg += [f'    <path d="{d}"/>' for d in fills]
svg += ['  </g>', '  <g id="lines" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">']
svg += [f'    <path d="{d}"/>' for d in lines]
svg += ['  </g>', '</svg>']
open('trace/ORF-16-stroke.svg', 'w').write('\n'.join(svg) + '\n')
print('wrote trace/ORF-16-stroke.svg')
