# KRM Client Portal — Release and security gates

**Current status:** staging only, with production launch disabled. No real client onboarding.

## Tested foundations
- Admin/client roles and membership authorization checked for every project read/write.
- Random sessions stored as hashes; Secure + HttpOnly + SameSite=Strict cookies.
- Salted scrypt passwords, per-session CSRF token, exact-origin write checks, login throttling.
- One-time expiring invitations with administrator revocation.
- Immediate project access revocation; disable client and terminate existing sessions; revoke all own sessions.
- Dedicated PostgreSQL 16 integration tests with fictional accounts.

## Blocking release criteria
- [ ] Dedicated PostgreSQL database, backups and a restore rehearsal.
- [ ] A real HTTPS domain and verified APP_ORIGIN; the staged portal.krm.invalid is intentionally nonfunctional.
- [ ] Initial owner admin provisioned securely out-of-band; remove setup password from runtime.
- [ ] Admin MFA (WebAuthn / passkey recommended), and tested account recovery workflow.
- [ ] Verify invited email ownership and implement a safe password recovery process.
- [ ] Independent authorization, session, logging, resilience and abuse testing before accepting real client data.
- [ ] Privacy notice, Impressum, data retention/deletion processes and required agreements.
- [ ] Private file storage with quotas, signed short-lived download links, malware checks before uploads.
- [ ] User-facing readiness review, accessibility, monitoring and security alerts.
- [ ] Explicit owner decision on any live Railway deployment and recurring charges.
- [ ] Explicit owner approval to set LAUNCH_ENABLED=true; never do this automatically.

## Staging
The GitHub Pages client-space-demo page is a PUBLIC design preview with fake data only.
The server application in client-portal runs separately with PostgreSQL, must use HTTPS, and is currently not live.
The pending Railway staging patch is not deployed and costs nothing until approved and applied.

## Sources
- OWASP Authorization: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Authentication: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Multifactor Authentication: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
