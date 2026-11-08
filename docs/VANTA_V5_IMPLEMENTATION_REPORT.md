# VANTA BARBER CLUB V5 — THE RITUAL
Date: 2026-11-08
Status: isolated preview implemented and browser-tested; previous V4 remains unchanged.

## Links
- V5 preview: https://kreamkilah.github.io/krm-digital-showcase/barber-v5-preview/
- Previous V4 preview: https://kreamkilah.github.io/krm-digital-showcase/barber-v4-preview/
- Original VANTA demo: https://kreamkilah.github.io/krm-digital-showcase/barber/
- Final QA: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/42527470613
- Source: `barber-v5-preview/index.html`

## What changed
1. Original luxury barbershop hero art, saved permanently as `assets/vanta-v5-hero.webp`. Self-contained optimized WebP (~65 KB). No temporary source URL in website code.
2. Premium black/bronze/ivory design system, updated hierarchy and typography; hero headline THE CUT. THE RITUAL.
3. New 3-scene scroll storytelling chapter `#ritual`: atmosphere / cut / detail. Sticky original scene image in mobile and desktop, with synchronized chapter index and crossfading imagery.
4. GSAP intro animation, parallax, 7 image-reveal masks on capable desktop devices, 5 animated editorial rules; degrades on mobile and reduced-motion settings.
5. Warm consistent color grading for illustrative stock images, refined services, editorial gallery and premium demo booking module.
6. Sticky blur navigation, mobile hamburger, skip link and scroll reading progress.
7. Preserved mock appointment selection, price display, modal, disclaimers and no data collection.

## Latest QA — Playwright Chromium
Run `42527470613`, all PASS:
- 360, 390, 768 and 1440 px viewport widths with reduced motion, **zero horizontal overflow**.
- Hero image loads, menu opens and closes, scene-02 image synchronization works.
- Demo booking interactive choices BEARD DESIGN / Tag B / 12:30 / 19 €, and mock modal opens and closes.
- No JavaScript page errors reported in tested flows.
- Real normal-motion desktop: GSAP 3.15.0 loaded, **7** photographic reveals, **5** section rules, zero overflow.
- Screenshots and full JSON report stored as `vanta-v5-visual-qa` artifact.

## Important limitations
- This is an independent, fictional brand. All prices and appointments are simulated. No real business, clients, testimonials, results or booked slots.
- Hero is AI-generated concept art; the majority of other images are illustrative Pexels stock photographs. Do not misrepresent them as actual client work.
- Smoke tests are **not** a Lighthouse/Core Web Vitals benchmark, formal WCAG audit or physical-device test.
- Legal website duties (imprint, privacy notice etc.) must be resolved before using this as an actual commercial site.
- The one-time hero import GitHub Actions workflow was removed. Its encrypted secret `VANTA_V5_HERO_URL` could not be deleted because GitHub requested account-owner email OTP verification; it is unused by any remaining importer.
- V4 remains untouched; promote V5 only after user's visual approval.

## Budget
- Cash from €50 exercise: €0 spent; €50 remains.
- Used 20 existing Runway image credits for the one original VANTA hero; remaining workspace balance last observed: 5 credits.
