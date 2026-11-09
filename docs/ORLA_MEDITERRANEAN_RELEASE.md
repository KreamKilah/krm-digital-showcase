# ORLA Mediterranean Table — Design concept, release 1
Date: 2026-11-09
Status: Published as a third showcase concept, integrated into KRM DIGITAL portfolio and smoke tested.

## Live links
- ORLA restaurant demo: https://kreamkilah.github.io/krm-digital-showcase/orla-mediterranean/
- KRM DIGITAL portfolio: https://kreamkilah.github.io/krm-digital-showcase/
- ORLA responsive QA: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/42594437074
- Portfolio integration QA: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/42595020947

## Art direction & structure
Completely separate from the automotive and barber designs:
- Warm coastal/mid-century Mediterranean visual identity: parchment, olive/deep green, terracotta, sunlit yellow, expressive Fraunces serif.
- Hero with large editorial headline and oval-cut overhead food image.
- Manifesto/philosophy and curated illustrative restaurant scene.
- Three signature-food feature cards.
- Interactive sample menu with three categories: small plates, mains and desserts (fictional example dishes and prices).
- Dining story, illustrative photo gallery and warm brand footer.
- Demo table booking using guest count, fictional sample day and fictional time; UI summary and modal; no real availability or user information collected.
- Light CSS scroll reveals, native JS; reduced-motion support; mobile responsive layout.
- Illustrative stock imagery sourced via Unsplash, disclosed in the footer. No fabricated real location, chef identity, reviews, ratings or booking availability.

## KRM DIGITAL portfolio
- Third featured case study added with a distinct terracotta/parchment color treatment.
- Three portfolio links: NOVA DETAIL, VANTA OFFGRID, ORLA Mediterranean.
- Live showroom includes ORLA tab and switches embedded previews and full-open URLs correctly.
- Existing projects and legacy VANTA archived.

## Verified browser quality assurance
ORLA QA run 42594437074: 
- Chrome widths **360, 390, 768, 1024, 1440**: PASS; zero horizontal document overflow.
- All **10** image elements fully decoded and verified at each width (after properly triggering lazy images).
- Sample menu category switching: PASS.
- Demo reservation updates to 4 persons / Tag B / 20:30 and modal opens/closes: PASS.
- Mobile hamburger navigation: PASS.
- Normal-motion browser smoke check: PASS.
- No JavaScript errors during tests.

KRM portfolio QA run 42595020947:
- 390 px and 1440 px: PASS; all 3 project cards, ORLA link, mobile & desktop live showroom tab switching, NOVA and VANTA switch-back, zero horizontal overflow, no JS page errors.

## Limitations before production
- This is an independent **fictional restaurant**. No real business, bookings, available tables, operating hours, address, chef, customer reviews or service contract.
- All menus and prices are illustrative. Real menu production needs actual ingredients, allergens and other legally mandatory disclosures.
- Unsplash imagery is illustrative; confirm licensing and replace with genuine authorized client photography for real commercial deployment.
- No Lighthouse/Core Web Vitals or physical-device/wide-browser audit done; smoke tests do not guarantee measured performance or accessibility.
- Privacy and legal obligations (Impressum, Datenschutzerklärung, booking provider and consent requirements where applicable) must be addressed before a real German business site.
- No real cash spent from original EUR 50 project capital; used existing GitHub Pages and remotely served stock image sources.

## Next
- Gather user's visual assessment of ORLA.
- If user approves, prepare promotional mockups and a simple sales-ready case study while distinguishing real work vs fictional demo.
