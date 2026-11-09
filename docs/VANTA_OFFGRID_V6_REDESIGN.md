# VANTA OFFGRID V6 — Complete Redesign
Date: 2026-11-09
Status: independent preview deployed and interactive QA passed.

## Links
- New from-scratch preview: https://kreamkilah.github.io/krm-digital-showcase/vanta-offgrid-preview/
- Matching source snapshot: `vanta-v6-offgrid/index.html`
- Alternate preview snapshot: `vanta-offgrid-preview/index.html`
- Previous VANTA V5: https://kreamkilah.github.io/krm-digital-showcase/barber-v5-preview/
- NOVA V5.2: https://kreamkilah.github.io/krm-digital-showcase/nova-v52-preview/
- QA run: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/42585657068

## What is genuinely different
- Former VANTA V5 and NOVA were both dark cinematic luxury single-page websites with huge hero typography, gold lighting, 3-card services, three-chapter scroll stories, dark booking UI.
- OFFGRID is **a new layout coded from scratch**: editorial/experimental *cream, black and acid lime* palette, energetic poster hero with asymmetric photo mount, stark typography, contrasting black philosophy editorial.
- Service **horizontal rows** instead of traditional three cards.
- Interactive **look selector** with 3 photo states instead of sticky scroll narrative.
- Horizontal **lime pricing grid** on a high-contrast chapter.
- **Ticket-builder** interaction and dynamic lime perforated ticket mockup rather than a standard appointment card.
- **Masonry editorial photo collage** with monochrome visuals instead of a card gallery.
- Distinctive oversized graphic footer.
- No GSAP or other animation library; lightweight CSS transitions + native IntersectionObserver used.
- Header menu, reduced-motion support, keyboard focus states and skip navigation remain.

## Fictional & legal clarity
VANTA is an invented company. No real business service, customer results, reviews or confirmed slots are offered.
All prices and days/times are examples. The appointment demo does not connect to a real calendar and does not collect or transmit user data.
Hero artwork was generated for a previous VANTA concept; other photography is illustrative Pexels stock and may not be represented as actual results.
Commercial operation would require legal, privacy and accessibility readiness; this preview is not a production client site.

## QA completed
Automated Chromium Playwright, run `42585657068`:
- 360px: PASS / overflow 0px.
- 390px: PASS / overflow 0px.
- 768px: PASS / overflow 0px.
- 1024px: PASS / overflow 0px.
- 1440px: PASS / overflow 0px.
- All sizes: style selector changed caption and active photo correctly.
- All sizes: ticket simulation choices BEARD DESIGN / Tag B / 12:30 / 19 € updated preview correctly; modal opened and closed.
- Mobile hamburger menu passed.
- No JavaScript page errors reported in covered workflows.
- Screenshots and report artifact: `vanta-offgrid-visual-evidence`.
- Still needed for commercial launch: Lighthouse/Core Web Vitals, physical-device testing, broader accessibility audit, legal/privacy information.

## Budget
Zero euros spent from the original €50 capital.
No new image generation credits spent for OFFGRID (reused previous original hero and illustrative stock).
Original VANTA V5 and NOVA are preserved; no promotion to official production has occurred.
