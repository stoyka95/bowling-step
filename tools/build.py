#!/usr/bin/env python3
"""Build krok pro statický web Bowling bar Step.

Dělá dvě věci:

1. **Cache busting** — ke každému odkazu na /css/style.css, /js/main.js a
   /js/booking.js v public/index.html doplní ?v=<hash obsahu>. Bez toho by
   prohlížeč držel starý soubor po celou dobu max-age z vercel.json a po
   nasazení by se nová verze neprojevila (HTML se revaliduje, assety ne).

2. **Kritické CSS** — vygeneruje kritickou část stylů a vloží ji inline do
   <style> v <head>. Kritická část = vše od začátku stylesheetu po sekci
   "Bento grid" (tokeny, reset, typografie, tlačítka, navigace, hero) plus
   pravidla pro scroll reveal. Zbytek se načítá asynchronně.

Spouštět z kořene repozitáře po každé úpravě public/css/style.css nebo
public/js/*.js:

    python3 tools/build.py
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
HTML = ROOT / 'public/index.html'
ASSETS = ['/css/style.css', '/js/main.js', '/js/booking.js']


def short_hash(path: pathlib.Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()[:10]


def add_cache_busting(html: str) -> str:
    for asset in ASSETS:
        file_path = ROOT / 'public' / asset.lstrip('/')
        version = short_hash(file_path)
        # nahradí i případnou starší ?v=... verzi
        pattern = re.escape(asset) + r'(\?v=[0-9a-f]+)?'
        html = re.sub(pattern, asset + '?v=' + version, html)
        print('%-18s ?v=%s' % (asset, version))
    return html


def build_critical_css() -> str:
    css = (ROOT / 'public/css/style.css').read_text(encoding='utf-8')
    critical = css[:css.index('/* ---------- Bento grid (USP) ---------- */')]
    critical += css[css.index('/* ---------- Scroll reveal ---------- */'):
                    css.index('/* ---------- Breakpointy ---------- */')]
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
    return mini.replace('; }', '}').replace(' {', '{').replace(': ', ':').replace(', ', ',')


def main() -> None:
    html = HTML.read_text(encoding='utf-8')
    html = add_cache_busting(html)
    critical = build_critical_css()
    html = re.sub(r'<style>.*?</style>', lambda _: '<style>' + critical + '</style>',
                  html, count=1, flags=re.S)
    HTML.write_text(html, encoding='utf-8')
    print('kritické CSS: %d B' % len(critical))


if __name__ == '__main__':
    main()
