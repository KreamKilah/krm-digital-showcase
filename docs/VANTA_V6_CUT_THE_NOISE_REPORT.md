# VANTA V6 — CUT THE NOISE
Date: 2026-11-08
Status: independent V6 preview built and browser-tested. V5 and V4 preserved.

## Why a fresh version?
User identified that VANTA V5 still looked like the earlier VANTA and shared visual mechanics with NOVA. Their request was a truly different website, not a stock-photo/color refresh.

## New design language
- V5: full-screen cinematic dark/bronze car-like hero, large overlaid type, conventional photo cards and same-family story sections.
- V6: editorial Swiss-inspired brand with warm paper (#f4f0e7), ink (#171b19), vivid orange (#e95630), monumental Anton typography, 2-column layout and more assertive asymmetry.
- The **same original barber chair hero image is deliberately reused** as a contained magazine-style art panel instead of a full-bleed background, to demonstrate that the structural design changed.
- Services replaced cards with 3 interactive editorial rows that update a shared photo/story panel.
- Gallery replaced with asymmetric magazine-style photo grid.
- Demo booking replaced by a light paper selector and a dark receipt/ticket UI.
- Added bold orange full-width manifesto and closing campaign sections.
- Independent CSS/JS, no GSAP dependence, respecting reduced motion and accessibility with native controls.

## Live
- V6: https://kreamkilah.github.io/krm-digital-showcase/barber-v6-preview/
- V5: https://kreamkilah.github.io/krm-digital-showcase/barber-v5-preview/
- V4: https://kreamkilah.github.io/krm-digital-showcase/barber-v4-preview/
- Production original: https://kreamkilah.github.io/krm-digital-showcase/barber/
- V6 QA final run: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/42530718708

## Tests
Playwright/Chromium checked 360, 390, 768 and 1440px:
- PASS at all four sizes, no document overflow, no page JavaScript exceptions.
- PASS responsive navigation open/close.
- PASS interactive services photo/title/description updates.
- PASS three-step demo ticket selection, aria-pressed selection state, price and mock modal.
- PASS normal-motion fade/reveal activation; reduced-motion paths tested.
- Screenshots in artifact `vanta-v6-editorial-qa` for the final workflow run.

## Integrity and limits
VANTA is completely fictional. Its hero is digitally generated concept art and other images are illustrative stock photographs. Prices and appointment interactions are examples only, with no real appointment availability or customer data processing. This is not a commercial client site. Cross-browser, accessibility audit and actual field Core Web Vitals remain outstanding.
No cash from challenge spent and no new generation credits needed for this redesign.
Do not change the original VANTA or KRM production portfolio until user has approved V6.
