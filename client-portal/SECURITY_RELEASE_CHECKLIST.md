# KRM Client Portal — Release and security gates

**Current status:** staging only, with production launch disabled. No real client onboarding.

## Tested foundations
- Admin/client roles and membership authorization checked for every project read/write.
- Random sessions stored as hashes; Secure + HttpOnly + SameSite=Strict cookies.
- Salted scrypt passwords, per-session CSRF token, exact-origin write checks, login throttling.
- One-time expiring invitations with administrator revocation, secure self-service password change and all-device logout.
- Immediate project access revocation; disable client and terminate existing sessions; revoke all own sessions.
- Dedicated PostgreSQL 16 integration tests with fictional accounts.

## Blocking release criteria
- [x] Dedicated PostgreSQL service and volume **staged** in Railway, unapplied and not billed as a running service.
- [ ] Apply the Railway patch only after explicit owner approval and confirm backups and a restore rehearsal.
- [ ] A real HTTPS domain and verified APP_ORIGIN; the staged portal.krm.invalid is intentionally nonfunctional.
- [ ] Initial owner admin provisioned securely out-of-band; remove setup password from runtime.
- [x] TOTP MFA enrollment, encrypted secret, recovery codes and challenge login implemented and covered by integration tests.
- [ ] Enroll the real owner using a securely generated MFA_ENCRYPTION_KEY and archive recovery codes safely. Prefer passkeys/WebAuthn longer-term.
- [ ] Verify secure recovery identity checks and rehearse account recovery.
- [ ] Verify invited email ownership and implement a safe forgotten-password reset process (not yet available).
- [ ] Independent authorization, session, logging, resilience and abuse testing before accepting real client data.
- [ ] Privacy notice, Impressum, data retention/deletion processes and required agreements.
- [ ] Private file storage with quotas, signed short-lived download links, malware checks before uploads.
- [ ] User-facing readiness review, accessibility, monitoring and security alerts.
- [ ] Explicit owner decision on any live Railway deployment and recurring charges.
- [ ] Explicit owner approval to set LAUNCH_ENABLED=true; never do this automatically.

## Staging
The GitHub Pages client-space-demo page is a PUBLIC design preview with fake data only.
The server application in client-portal runs separately with PostgreSQL, must use HTTPS, and is currently not live.
The pending Railway staging patch contains the API and an isolated PostgreSQL service with a persistent volume. It is not deployed and has no running-service charges until approved and applied. APP_ORIGIN remains intentionally set to the unusable placeholder https://portal.krm.invalid.

## Sources
- OWASP Authorization: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Authentication: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Multifactor Authentication: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
