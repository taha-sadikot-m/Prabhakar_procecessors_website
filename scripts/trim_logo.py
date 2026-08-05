"""Derive web-ready logo assets from the master brand SVG.

The master file is a 2048x2048 traced export: it carries an opaque white plate
behind the artwork and paints letter counters in white rather than cutting them
out. Both make it unusable straight on the cream surfaces the site uses, so this
script drops the plate, repaints counters in the surface tone, and crops the
viewBox to the ink.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "prabhakarlogo_logo.svg"
OUT_DIR = ROOT / "public" / "logo"

WHITE = "rgb(255,255,255)"
SURFACE = "#FAF0E6"

# Indices of the paths that make up the needle-and-thread mark; everything else
# in the master file belongs to the two-line wordmark.
MARK = {6, 7, 33, 34, 35, 36, 37, 38}

PATH_RE = re.compile(r'<path[^>]*?fill="(rgb\([^)]*\))"[^>]*?d="([^"]+)"[^>]*?/>')


def bbox(d):
    nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", d)]
    xs, ys = nums[0::2], nums[1::2]
    return min(xs), min(ys), max(xs), max(ys)


def build(paths, title, plate=False):
    x0 = min(bbox(d)[0] for f, d in paths if f != WHITE)
    y0 = min(bbox(d)[1] for f, d in paths if f != WHITE)
    x1 = max(bbox(d)[2] for f, d in paths if f != WHITE)
    y1 = max(bbox(d)[3] for f, d in paths if f != WHITE)
    w, h = x1 - x0, y1 - y0

    body = ""
    if plate:
        # Square the frame around the ink and back it with the surface tone, so
        # the icon stays legible on a dark browser chrome.
        side = max(w, h) * 1.28
        x0, y0 = x0 + w / 2 - side / 2, y0 + h / 2 - side / 2
        w = h = side
        body += '  <rect x="{:.2f}" y="{:.2f}" width="{:.2f}" height="{:.2f}" rx="{:.2f}" fill="{}"/>\n'.format(
            x0, y0, w, h, side * 0.18, SURFACE
        )

    body += "\n".join(
        '  <path fill="{}" d="{}"/>'.format(SURFACE if f == WHITE else f, d)
        for f, d in paths
    )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" '
        'viewBox="{:.2f} {:.2f} {:.2f} {:.2f}" role="img" '
        'aria-label="{}">\n{}\n</svg>\n'.format(x0, y0, w, h, title, body)
    ), (w, h)


def main():
    svg = SRC.read_text(encoding="utf-8")
    all_paths = PATH_RE.findall(svg)

    # Index 0 is the full-canvas white plate.
    lockup = [p for i, p in enumerate(all_paths) if i != 0]
    mark = [p for i, p in enumerate(all_paths) if i in MARK]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    out, size = build(lockup, "Prabhakar Processors")
    (OUT_DIR / "prabhakar-processors-logo.svg").write_text(out, encoding="utf-8")
    print("lockup  {:.0f} x {:.0f}  ratio {:.3f}".format(*size, size[0] / size[1]))

    out, size = build(mark, "Prabhakar Processors")
    (OUT_DIR / "prabhakar-processors-mark.svg").write_text(out, encoding="utf-8")
    print("mark    {:.0f} x {:.0f}  ratio {:.3f}".format(*size, size[0] / size[1]))

    out, size = build(mark, "Prabhakar Processors", plate=True)
    (ROOT / "public" / "favicon.svg").write_text(out, encoding="utf-8")
    print("favicon {:.0f} x {:.0f}  ratio {:.3f}".format(*size, size[0] / size[1]))


if __name__ == "__main__":
    main()
