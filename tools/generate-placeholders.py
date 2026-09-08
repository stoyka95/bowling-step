# -*- coding: utf-8 -*-
"""Generátor placeholder ilustrací (SVG) pro redesign Bowling bar Step.
Žádné externí assety – čistě vektorové scény laděné do palety bílá/zlatá/zelená.
Nahradit skutečnými fotografiemi, jakmile je klient dodá."""
import os, math, random

GREEN_D = "#0F2B22"; GREEN = "#1F5D3C"; GREEN_L = "#2A4A38"
GOLD = "#C9A24B"; GOLD_S = "#E8D9B5"; IVORY = "#F2EFE6"

def head(w, h, uid):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">
<defs>
<linearGradient id="bg{uid}" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="{GREEN_D}"/><stop offset=".6" stop-color="{GREEN}"/><stop offset="1" stop-color="{GREEN_L}"/></linearGradient>
<radialGradient id="glow{uid}" cx="50%" cy="8%" r="70%">
<stop offset="0" stop-color="{GOLD}" stop-opacity=".55"/><stop offset=".45" stop-color="{GOLD}" stop-opacity=".12"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig{uid}" cx="50%" cy="45%" r="75%">
<stop offset=".42" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>
<linearGradient id="lane{uid}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{GOLD_S}" stop-opacity=".16"/><stop offset=".55" stop-color="{GOLD_S}" stop-opacity=".42"/><stop offset="1" stop-color="{GOLD_S}" stop-opacity=".72"/></linearGradient>
<linearGradient id="beam{uid}" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{GOLD}" stop-opacity=".38"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/></linearGradient>
<filter id="blur{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="soft{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<rect width="{w}" height="{h}" fill="url(#bg{uid})"/>
<rect width="{w}" height="{h}" fill="url(#glow{uid})"/>'''

def tail(w, h, uid):
    return f'<rect width="{w}" height="{h}" fill="url(#vig{uid})"/>\n</svg>\n'

def lights(w, h, uid, n=5):
    out = []
    for i in range(n):
        x = w * (i + .5) / n
        y = h * .12
        out.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{w*0.07:.0f}" ry="{h*0.03:.0f}" fill="{GOLD_S}" opacity=".5" filter="url(#blur{uid})"/>')
        out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{w*0.012:.0f}" fill="{GOLD_S}" opacity=".9"/>')
        out.append(f'<path d="M{x-w*0.05:.0f} {y:.0f} L{x+w*0.05:.0f} {y:.0f} L{x+w*0.14:.0f} {h*0.62:.0f} L{x-w*0.14:.0f} {h*0.62:.0f} Z" fill="url(#beam{uid})" opacity=".55"/>')
    return "".join(out)

def pin(x, y, s, fill=IVORY, op=1.0):
    return (f'<path transform="translate({x:.1f},{y:.1f}) scale({s:.3f})" opacity="{op}" fill="{fill}" '
            f'd="M0,-46 C7,-46 11,-39 11,-32 C11,-26 7,-22 6,-18 C13,-13 17,-5 17,5 '
            f'C17,17 10,26 0,26 C-10,26 -17,17 -17,5 C-17,-5 -13,-13 -6,-18 '
            f'C-7,-22 -11,-26 -11,-32 C-11,-39 -7,-46 0,-46 Z"/>'
            f'<path transform="translate({x:.1f},{y:.1f}) scale({s:.3f})" opacity="{op*0.75}" fill="{GOLD}" d="M-10,-25 h20 v7 h-20 z"/>')

def pin_rack(cx, cy, s, uid):
    rows = [(0,0),(-1,1),(1,1),(-2,2),(0,2),(2,2),(-3,3),(-1,3),(1,3),(3,3)]
    out = []
    for dx, dy in rows:
        x = cx + dx * 26 * s
        y = cy + dy * 30 * s
        out.append(f'<ellipse cx="{x:.0f}" cy="{y+26*s:.0f}" rx="{18*s:.0f}" ry="{5*s:.0f}" fill="#000" opacity=".28" filter="url(#soft{uid})"/>')
        out.append(pin(x, y, s))
    return "".join(out)

def lanes(w, h, uid, count=3):
    """Perspektivní pohled na dráhy."""
    out = []
    horizon = h * .42
    out.append(f'<rect y="{horizon:.0f}" width="{w}" height="{h-horizon:.0f}" fill="{GREEN_D}" opacity=".55"/>')
    for i in range(count):
        top_w = w * .09
        gap_t = w * .015
        total_t = count * top_w + (count - 1) * gap_t
        tx = (w - total_t) / 2 + i * (top_w + gap_t)
        bot_w = w * .30
        gap_b = w * .05
        total_b = count * bot_w + (count - 1) * gap_b
        bx = (w - total_b) / 2 + i * (bot_w + gap_b)
        out.append(f'<path d="M{tx:.0f},{horizon:.0f} L{tx+top_w:.0f},{horizon:.0f} L{bx+bot_w:.0f},{h} L{bx:.0f},{h} Z" fill="url(#lane{uid})"/>')
        out.append(f'<path d="M{tx+top_w/2:.0f},{horizon:.0f} L{bx+bot_w/2:.0f},{h}" stroke="{GOLD}" stroke-opacity=".22" stroke-width="2"/>')
        out.append(pin_rack(tx + top_w/2, horizon - h*0.075, 0.34 * (w/1200), uid))
    return "".join(out)

def ball(x, y, r, color=GREEN_D):
    return (f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{color}"/>'
            f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="none" stroke="{GOLD}" stroke-opacity=".45" stroke-width="{r*0.06:.1f}"/>'
            f'<ellipse cx="{x-r*0.32:.0f}" cy="{y-r*0.38:.0f}" rx="{r*0.34:.0f}" ry="{r*0.24:.0f}" fill="{IVORY}" opacity=".28"/>'
            f'<circle cx="{x-r*0.18:.0f}" cy="{y+r*0.05:.0f}" r="{r*0.11:.0f}" fill="#000" opacity=".45"/>'
            f'<circle cx="{x+r*0.16:.0f}" cy="{y-r*0.02:.0f}" r="{r*0.10:.0f}" fill="#000" opacity=".45"/>'
            f'<circle cx="{x:.0f}" cy="{y+r*0.28:.0f}" r="{r*0.10:.0f}" fill="#000" opacity=".45"/>')

def people(w, h, uid, n=5, base=None, scale=1.0, op=.85):
    base = base or h * .96
    out = []
    rnd = random.Random(7)
    for i in range(n):
        x = w * (i + .6) / (n + .6) + rnd.uniform(-w*.03, w*.03)
        s = scale * rnd.uniform(.85, 1.12)
        hh = h * .34 * s
        head_r = hh * .13
        out.append(f'<g opacity="{op}" fill="{GREEN_D}">'
                   f'<circle cx="{x:.0f}" cy="{base-hh:.0f}" r="{head_r:.0f}"/>'
                   f'<path d="M{x-hh*0.20:.0f},{base} C{x-hh*0.22:.0f},{base-hh*0.62:.0f} {x-hh*0.16:.0f},{base-hh*0.80:.0f} {x:.0f},{base-hh*0.82:.0f} '
                   f'C{x+hh*0.16:.0f},{base-hh*0.80:.0f} {x+hh*0.22:.0f},{base-hh*0.62:.0f} {x+hh*0.20:.0f},{base} Z"/></g>')
    return "".join(out)

def bar_counter(w, h, uid):
    out = []
    top = h * .60
    out.append(f'<rect x="0" y="{top:.0f}" width="{w}" height="{h-top:.0f}" fill="{GREEN_D}" opacity=".85"/>')
    out.append(f'<rect x="0" y="{top:.0f}" width="{w}" height="{h*0.03:.0f}" fill="{GOLD}" opacity=".55"/>')
    # police s lahvemi
    shelf = h * .30
    out.append(f'<rect x="{w*0.08:.0f}" y="{shelf:.0f}" width="{w*0.84:.0f}" height="4" fill="{GOLD}" opacity=".4"/>')
    rnd = random.Random(3)
    x = w * .12
    while x < w * .88:
        bw = w * rnd.uniform(.018, .028)
        bh = h * rnd.uniform(.10, .16)
        out.append(f'<path d="M{x:.0f},{shelf:.0f} L{x:.0f},{shelf-bh*0.62:.0f} L{x+bw*0.35:.0f},{shelf-bh*0.78:.0f} '
                   f'L{x+bw*0.35:.0f},{shelf-bh:.0f} L{x+bw*0.65:.0f},{shelf-bh:.0f} L{x+bw*0.65:.0f},{shelf-bh*0.78:.0f} '
                   f'L{x+bw:.0f},{shelf-bh*0.62:.0f} L{x+bw:.0f},{shelf:.0f} Z" fill="{GOLD_S}" opacity="{rnd.uniform(.22,.6):.2f}"/>')
        x += bw + w * rnd.uniform(.012, .03)
    # sklenice na pultu
    for i in range(4):
        gx = w * (.2 + i * .2)
        gh = h * .09
        out.append(f'<path d="M{gx-gh*0.28:.0f},{top-gh:.0f} L{gx+gh*0.28:.0f},{top-gh:.0f} L{gx+gh*0.16:.0f},{top:.0f} L{gx-gh*0.16:.0f},{top:.0f} Z" fill="{GOLD_S}" opacity=".45"/>')
    return "".join(out)

def billiards(w, h, uid):
    out = []
    cy = h * .62
    out.append(f'<ellipse cx="{w*0.5:.0f}" cy="{cy+h*0.06:.0f}" rx="{w*0.42:.0f}" ry="{h*0.10:.0f}" fill="#000" opacity=".35" filter="url(#blur{uid})"/>')
    out.append(f'<rect x="{w*0.08:.0f}" y="{cy-h*0.18:.0f}" width="{w*0.84:.0f}" height="{h*0.30:.0f}" rx="{h*0.03:.0f}" fill="{GREEN}"/>')
    out.append(f'<rect x="{w*0.08:.0f}" y="{cy-h*0.18:.0f}" width="{w*0.84:.0f}" height="{h*0.30:.0f}" rx="{h*0.03:.0f}" fill="none" stroke="{GOLD}" stroke-opacity=".5" stroke-width="{h*0.014:.0f}"/>')
    out.append(f'<rect x="{w*0.12:.0f}" y="{cy-h*0.14:.0f}" width="{w*0.76:.0f}" height="{h*0.22:.0f}" rx="{h*0.012:.0f}" fill="{GREEN_L}" opacity=".8"/>')
    rnd = random.Random(11)
    for i in range(9):
        bx = w * rnd.uniform(.2, .82); by = cy + h * rnd.uniform(-.10, .05)
        col = [IVORY, GOLD, GOLD_S, "#B3453A", GREEN_D][i % 5]
        out.append(f'<circle cx="{bx:.0f}" cy="{by:.0f}" r="{h*0.022:.0f}" fill="{col}" opacity=".92"/>')
    out.append(f'<path d="M{w*0.18:.0f},{cy-h*0.24:.0f} L{w*0.62:.0f},{cy-h*0.02:.0f}" stroke="{GOLD_S}" stroke-width="{h*0.012:.0f}" stroke-linecap="round" opacity=".8"/>')
    return "".join(out)

def foosball(w, h, uid):
    out = []
    cy = h * .60
    out.append(f'<rect x="{w*0.10:.0f}" y="{cy-h*0.16:.0f}" width="{w*0.80:.0f}" height="{h*0.30:.0f}" rx="{h*0.02:.0f}" fill="{GREEN}"/>')
    out.append(f'<rect x="{w*0.10:.0f}" y="{cy-h*0.16:.0f}" width="{w*0.80:.0f}" height="{h*0.30:.0f}" rx="{h*0.02:.0f}" fill="none" stroke="{GOLD}" stroke-opacity=".45" stroke-width="{h*0.012:.0f}"/>')
    for i in range(5):
        rx = w * (.18 + i * .16)
        out.append(f'<line x1="{rx:.0f}" y1="{cy-h*0.22:.0f}" x2="{rx:.0f}" y2="{cy+h*0.20:.0f}" stroke="{GOLD_S}" stroke-opacity=".7" stroke-width="{h*0.008:.0f}"/>')
        for j in range(3):
            fy = cy - h*0.10 + j * h*0.10
            out.append(f'<rect x="{rx-w*0.012:.0f}" y="{fy:.0f}" width="{w*0.024:.0f}" height="{h*0.055:.0f}" rx="{w*0.008:.0f}" fill="{IVORY}" opacity=".85"/>')
    return "".join(out)

def shoes(w, h, uid):
    out = []
    for i, (ox, oy) in enumerate([(w*0.30, h*0.55), (w*0.58, h*0.66)]):
        out.append(f'<g transform="translate({ox:.0f},{oy:.0f}) scale({w/900:.3f})">'
                   f'<path d="M-150,40 C-150,-10 -120,-40 -70,-46 C-30,-50 0,-30 40,-10 C90,15 140,20 160,34 C176,45 172,68 150,72 L-120,72 C-140,72 -150,60 -150,40 Z" fill="{IVORY}" opacity=".92"/>'
                   f'<path d="M-150,46 L160,46 C176,52 172,68 150,72 L-120,72 C-140,72 -150,62 -150,46 Z" fill="{GOLD}" opacity=".85"/>'
                   f'<path d="M-70,-40 L20,-6 M-90,-28 L10,10 M-105,-14 L0,24" stroke="{GREEN}" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/></g>')
    return "".join(out)

def card_scene(w, h, uid):
    out = []
    out.append(f'<rect x="{w*0.22:.0f}" y="{h*0.36:.0f}" width="{w*0.50:.0f}" height="{h*0.32:.0f}" rx="{h*0.04:.0f}" fill="{GREEN_D}" opacity=".9" transform="rotate(-8 {w*0.5:.0f} {h*0.5:.0f})"/>')
    out.append(f'<rect x="{w*0.22:.0f}" y="{h*0.46:.0f}" width="{w*0.50:.0f}" height="{h*0.05:.0f}" fill="{GOLD}" opacity=".8" transform="rotate(-8 {w*0.5:.0f} {h*0.5:.0f})"/>')
    out.append(f'<rect x="{w*0.30:.0f}" y="{h*0.42:.0f}" width="{w*0.50:.0f}" height="{h*0.32:.0f}" rx="{h*0.04:.0f}" fill="{IVORY}" opacity=".95" transform="rotate(6 {w*0.5:.0f} {h*0.5:.0f})"/>')
    out.append(f'<rect x="{w*0.34:.0f}" y="{h*0.50:.0f}" width="{w*0.14:.0f}" height="{h*0.10:.0f}" rx="{h*0.012:.0f}" fill="{GOLD}" opacity=".9" transform="rotate(6 {w*0.5:.0f} {h*0.5:.0f})"/>')
    return "".join(out)

def parking(w, h, uid):
    out = []
    out.append(f'<rect x="0" y="{h*0.55:.0f}" width="{w}" height="{h*0.45:.0f}" fill="{GREEN_D}" opacity=".7"/>')
    for i in range(4):
        x = w * (.12 + i * .24)
        out.append(f'<path d="M{x:.0f},{h*0.98:.0f} L{x+w*0.05:.0f},{h*0.60:.0f} L{x+w*0.14:.0f},{h*0.60:.0f} L{x+w*0.13:.0f},{h*0.98:.0f} Z" fill="{GOLD_S}" opacity=".22"/>')
    cy = h * .70
    out.append(f'<path d="M{w*0.28:.0f},{cy:.0f} L{w*0.34:.0f},{cy-h*0.10:.0f} L{w*0.62:.0f},{cy-h*0.10:.0f} L{w*0.70:.0f},{cy:.0f} L{w*0.72:.0f},{cy+h*0.10:.0f} L{w*0.26:.0f},{cy+h*0.10:.0f} Z" fill="{IVORY}" opacity=".9"/>')
    out.append(f'<circle cx="{w*0.36:.0f}" cy="{cy+h*0.10:.0f}" r="{h*0.045:.0f}" fill="{GREEN_D}"/><circle cx="{w*0.63:.0f}" cy="{cy+h*0.10:.0f}" r="{h*0.045:.0f}" fill="{GREEN_D}"/>')
    return "".join(out)

SCENES = {}
def scene(name, w, h, body_fn):
    uid = str(abs(hash(name)) % 9999)
    return head(w, h, uid) + body_fn(w, h, uid) + tail(w, h, uid)

def s_hero(w, h, u): return lights(w, h, u, 5) + lanes(w, h, u) + ball(w*0.33, h*0.88, h*0.075)
def s_lanes(w, h, u): return lights(w, h, u, 4) + lanes(w, h, u) + ball(w*0.63, h*0.86, h*0.075)
def s_firemni(w, h, u): return lights(w, h, u, 4) + bar_counter(w, h, u) + people(w, h, u, 5, base=h*0.62, scale=.50, op=.9)
def s_oslavy(w, h, u): return lights(w, h, u, 6) + people(w, h, u, 5, base=h*0.96, scale=.75, op=.92) + "".join(
    f'<circle cx="{w*x:.0f}" cy="{h*y:.0f}" r="{h*r:.0f}" fill="{c}" opacity=".55"/>' for x, y, r, c in
    [(.14,.22,.035,GOLD),(.32,.14,.024,GOLD_S),(.72,.18,.030,GOLD),(.88,.28,.022,GOLD_S),(.55,.10,.020,GOLD)])
def s_raut(w, h, u): return lights(w, h, u, 3) + bar_counter(w, h, u)
def s_kulecnik(w, h, u): return lights(w, h, u, 3) + billiards(w, h, u)
def s_fotbalek(w, h, u): return lights(w, h, u, 3) + foosball(w, h, u)
def s_boty(w, h, u): return lights(w, h, u, 3) + shoes(w, h, u)
def s_karta(w, h, u): return lights(w, h, u, 3) + card_scene(w, h, u)
def s_parkovani(w, h, u): return lights(w, h, u, 3) + parking(w, h, u)
def s_pins(w, h, u): return lights(w, h, u, 3) + f'<g>{pin_rack(w*0.5, h*0.42, 1.15*(w/1200), u)}</g>'
def s_bar(w, h, u): return lights(w, h, u, 5) + bar_counter(w, h, u) + people(w, h, u, 3, base=h*0.62, scale=.5, op=.9)

FILES = [
    ("hero-lanes", 1200, 900, s_hero),
    ("bowling", 1000, 750, s_lanes),
    ("firemni-akce", 1000, 750, s_firemni),
    ("oslavy", 1000, 750, s_oslavy),
    ("raut", 1000, 750, s_raut),
    ("galerie-1", 900, 1125, s_pins),
    ("galerie-2", 900, 675, s_lanes),
    ("galerie-3", 900, 675, s_kulecnik),
    ("galerie-4", 900, 675, s_bar),
    ("galerie-5", 900, 675, s_fotbalek),
    ("galerie-6", 900, 1125, s_boty),
    ("parkovani", 800, 600, s_parkovani),
    ("karta", 800, 600, s_karta),
    ("og", 1200, 630, s_hero),
]
os.makedirs("public/img/placeholder", exist_ok=True)
for name, w, h, fn in FILES:
    svg = scene(name, w, h, fn)
    open(f"public/img/placeholder/{name}.svg", "w", encoding="utf-8").write(svg)
    print(name, len(svg))
