# KRM Client Space — Private application (staging hardening)

**State: security-first development / not launched.** This is separate from the public UX mockup at /client-space-demo/. The source code can be public, but **it contains no customer records or secrets**. Do not store credentials in GitHub or GitHub Pages.

## Implemented
- Dedicated Node.js 22+ / Express 5.3 API and PostgreSQL, serving frontend and API on the **same HTTPS origin**.
- User roles: admin and client, with immediate per-project membership revocation, account disable/reactivation, pending-invitation cancellation and an auditable access list. Every project read/write checks authorization.
- Long random sessions; only the SHA-256 digest of the session token is stored in PostgreSQL. Cookie is Secure + HttpOnly + SameSite=Strict + __Host- prefix; server-side logout and 8h expiry.
- Passwords use per-user random-salt scrypt hashing. Self-service password changes require the current password and invalidate all sessions. No public signup: admin creates one-time invitation links valid for 48h.
- State-changing requests are origin-checked and use per-session CSRF tokens. TOTP MFA uses an AES-256-GCM-encrypted secret and one-time hashed recovery codes; enrolled users must pass a 5-minute MFA challenge before any session is issued.
- Login attempts throttled in PostgreSQL by both email and IP; parameterized SQL; output uses safe textContent DOM rendering.
- Admin: create projects, update stage/progress, add milestones, request version approval, invite new clients or assign existing ones.
- Client: review own project, write feedback, approve or request changes on pending version approval.
- No client uploads, payment processing or invoices in this release. Those need private object storage and additional review.
- Every invite, approval, comment and project modification is auditable.
- Production launch intentionally disabled by default, even if a service is deployed. MFA enrollment additionally requires an MFA_ENCRYPTION_KEY environment secret; CI uses a disposable key.

## Required environment variables
DATABASE_URL, APP_ORIGIN, NODE_ENV=production, LAUNCH_ENABLED=false, PORT=3000. Additionally, MFA_ENCRYPTION_KEY is required before enrolling MFA accounts (32 random bytes, base64url-encoded). Never put it in source files or logs.

APP_ORIGIN must be exact HTTPS origin (scheme + hostname + optional nondefault port), without trailing path or slash. The app checks this on every write.

## Local development (dedicated non-production database)
1. Run npm install in this directory.
2. Configure DATABASE_URL to a **dedicated PostgreSQL test database**, and APP_ORIGIN=http://localhost:3000 with NODE_ENV=development.
3. Run npm run db:migrate.
4. To create the initial administrator **once**, set SETUP_ADMIN_EMAIL, SETUP_ADMIN_PASSWORD (minimum 12 characters) and optional SETUP_ADMIN_NAME in your local environment. Run npm run admin:create. Then delete those setup variables.
5. Run npm start. Use the same host given by APP_ORIGIN, e.g. http://localhost:3000.

**Important:** the browser requires HTTPS for the production __Host- session cookie. On localhost browsers generally permit Secure cookies; use a local HTTPS proxy if required.

## Production deployment gates — NOT COMPLETE
- Railway project and isolated PostgreSQL have been **staged only**, not deployed. The API has a pending DATABASE_URL reference to the staged Postgres service; do not share the NEXO database or volume.
- TLS domain and correct APP_ORIGIN, database backups, application logs that do not expose session or invite tokens.
- Real owner admin provisioned via secure out-of-band environment; remove setup password afterwards.
- MFA code is implemented and tested, but a real administrator has not enrolled yet. Mandate MFA and recovery-code storage for admins; email ownership verification and password recovery must be added before onboarding paying clients.
- External security review of authorization, CSRF, login abuse/rate limits, database permissions and retention/deletion.
- Data processing / privacy notice, Impressum, user access requests, retention policy, contractual/hosting compliance.
- File security design, signed URLs, quotas and malware scan before enabling uploads.
- Rotate auth credentials, rehearse recovery, monitor and alarm on failures.
- **Only after all gates**, set LAUNCH_ENABLED=true and expose a public domain; users should not enter real personal data until then.

## GitHub Pages limitation
GitHub Pages is only for the PUBLIC design demo. Never place real passwords, authentication, customer project data or invoices in static repository files. The server code inside client-portal/ is a separate service and must be deployed with a database and HTTPS on a different origin.

## End-to-end tests
Node built-in tests plus PostgreSQL 16 and Playwright Chromium in GitHub Actions. No production secrets are used. Tests cover tenant separation, revocation, login, CSRF, invitation handling, comments, approvals, TOTP MFA, recovery codes, and browser interactions.

## Open design choice
Email delivery, billing and secure files are not enabled. Admin provisioning, invitation UX, access revocation, MFA enrollment and TOTP recovery-code UX are implemented, but production email verification and password recovery are not enabled. Initial invitations are generated by a logged-in administrator and copied through a private channel; tokens should never be forwarded to third parties. Real operations need email verification and anti-phishing design.
