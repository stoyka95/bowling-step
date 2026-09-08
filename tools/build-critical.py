#!/usr/bin/env python3
"""Vygeneruje kritické CSS a vloží ho inline do public/index.html.

Kritická část = vše od začátku stylesheetu po sekci "Bento grid"
(tokeny, reset, typografie, tlačítka, navigace, hero) plus pravidla
pro scroll reveal. Zbytek stylů se načítá asynchronně.

Spouštět z kořene repozitáře po každé úpravě public/css/style.css:
    python3 tools/build-critical.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
css = (ROOT / 'public/css/style.css').read_text(encoding='utf-8')

idx = css.index('/* ---------- Bento grid (USP) ---------- */')
critical = css[:idx]
critical += css[css.index('/* ---------- Scroll reveal ---------- */'):css.index('/* ---------- Breakpointy ---------- */')]
critical += (
    "@media (prefers-reduced-motion: reduce){.reveal,.reveal-stagger > *"
    "{opacity:1!important;transform:none!important}}\n"
    "@media (min-width:900px){.nav__list{display:flex}.nav__cta{display:inline-flex}"
    ".nav__toggle{display:none}.hero__inner{grid-template-columns:1.05fr .95fr}}\n"
    "@media (min-width:640px){.hero__scroll{display:flex}}\n"
)

mini = re.sub(r'/\*.*?\*/', '', critical, flags=re.S)
mini = re.sub(r'\s*\n\s*', '', mini)
mini = re.sub(r'\s{2,}', ' ', mini)
mini = mini.replace('; }', '}').replace(' {', '{').replace(': ', ':').replace(', ', ',')

html_path = ROOT / 'public/index.html'
html = html_path.read_text(encoding='utf-8')
html = re.sub(r'<style>.*?</style>', '<style>' + mini + '</style>', html, count=1, flags=re.S)
html_path.write_text(html, encoding='utf-8')
print('kritické CSS: %d B' % len(mini))
