# KRM DIGITAL — Client Space Private Staging Report
Date: 11 November 2026
Status: feature-complete security-focused staging foundation; **NOT LIVE / NOT OPEN FOR REAL CUSTOMERS**.

## Verified implementation
- Node.js / Express / PostgreSQL service under client-portal/.
- User roles admin and client, memberships scoped per project, deny-by-default access.
- Login using salted scrypt passwords, hashed random session tokens, Secure + HttpOnly + SameSite=Strict cookies, explicit CSRF and origin checks.
- TOTP 2FA with AES-256-GCM encrypted factors, no outside QR provider, single-use hashed recovery codes, timed one-use challenges and login throttling.
- Admin access list, instant per-project revocation, invitation revocation, account disable/reenable with session invalidation.
- User self-service password change and all-device logout.
- Projects, comments, milestones and approval decisions, audit events.
- Original browser UI includes MFA login, enrollment, admin security management and recovery-code display.

## Quality evidence
- Private security CI: https://github.com/KreamKilah/krm-digital-showcase/actions/runs/43078766854
- 17 / 17 PostgreSQL integration/security tests pass.
- Playwright Chromium user interface tests pass at 390px and 1440px: two-factor flow, admin access revocation, account setup and one-time recovery codes. No horizontal page overflow.
- CI also validates Node.js syntax and SQL migrations.

## Railway — unapplied patch
- Separate Railway project: KRM Client Space / staging.
- Pending only: API service krm-private-portal-api, Postgres and postgres-volume.
- Both services are still **staged-create**; no live deployments or domains exist.
- API DATABASE_URL points to the staged PostgreSQL service via Railway private reference.
- LAUNCH_ENABLED=false, NODE_ENV=production, APP_ORIGIN=https://portal.krm.invalid as intentional non-operational placeholder.
- Start command: npm start. Pre-deploy migration: npm run db:migrate.
- No Railway patch was applied, no real customer records, emails or passwords provisioned, no payment authorized.
- **Region gate:** the staged Postgres/volume currently uses a US region (SFO). Select an appropriate EU Railway region and confirm volume locality BEFORE applying the patch for EU client data. Never assume staging region is appropriate for production.

## Production blockers (not solved)
1. Review operating costs and explicitly approve deployment.
2. Select required data region, hosting processor terms, backup policy and restore rehearsal.
3. Set real HTTPS APP_ORIGIN, configure secure database access and generate MFA_ENCRYPTION_KEY through private Railway secrets.
4. Privately provision the owner administrator, enroll MFA, store recovery codes, and remove bootstrap password variables.
5. Build verified-email invitations and safe forgotten-password reset / account recovery workflow. Manual token forwarding is not yet sufficient for real onboarding.
6. Complete independent security review, retention/deletion compliance, privacy/Impressum and monitoring.
7. Secure private file storage, signed-download links and billing only after their own permission tests.
8. Explicitly change LAUNCH_ENABLED=true only after meeting every release gate.

## Links
- Private application code: https://github.com/KreamKilah/krm-digital-showcase/tree/main/client-portal
- Public **fictional UX demo only**: https://kreamkilah.github.io/krm-digital-showcase/client-space-demo/
- Release checklist: https://github.com/KreamKilah/krm-digital-showcase/blob/main/client-portal/SECURITY_RELEASE_CHECKLIST.md

No cash from the original EUR 50 challenge has been used in these development changes. Running infrastructure has NOT been activated.
