# NextStep — verification record

Date: 2026-10-14. Target: the Vercel migration package, not the live Sites demo.
Environment: Linux, Node 24.19.0, pnpm 11.25.0, Next.js 16.3.8.

## Executed on this package

| Check | Result | What this establishes |
|---|---|---|
| `pnpm typecheck` | PASS | TypeScript validates application and test source |
| Checklist model suite | PASS | 32 task action links, dependency/stage ordering, cohort deadlines, deadline priority, progress, state recovery and Chicago timezone behavior |
| Validation and SSO unit suites | 9 tests PASS | Fall/Spring only; invalid dates/statuses/owners rejected; body shape/report limits; mutation origin; canonical origin; configured SAML provider required; HTTPS Auth redirects |
| Embedded PostgreSQL suite | 38 checks PASS | Both migrations execute; RLS; anonymous denial; A/B read/update/delete isolation; owner spoofing blocked; membership private; revocation and expiry; revision conflicts; rollback; reports/reset; Auth deletion cascades; no public SECURITY DEFINER function; RLS on all public tables |
| `pnpm build` | PASS | Optimized production build produces demo, authenticated routes and API without Sites/Cloudflare runtime bindings |
| `pnpm audit --json` | 0 known vulnerabilities reported | Registry advisory check of the final dependency graph on this date; this is not a penetration test or security guarantee |

The final `pnpm check` repeated TypeScript, model/unit/SQL tests and build on the final dependency inputs. No genuine student records or credentials were used.

## Changes made during review

- Upgraded Next.js from 16.3.4 to 16.3.8 and updated vulnerable transitive dependencies. Kept the package age policy and frozen lockfile install.
- Pinned Supabase package versions.
- Removed the unused ESLint toolchain and its obsolete configuration because it pulled in an unpatched `braces` dependency. There was no lint script or lint CI gate to remove. TypeScript, behavioral/database tests, build and the browser CI job remain.
- Moved the privileged membership lookup into the unexposed private schema; the public wrapper runs as invoker.
- Required typed profile values and complete SAML provider configuration.
- Made sign-in return an HTTPS navigation URL to the client; the browser initiates navigation without widening the CSP form policy.

## Not yet verified

- **Browser/mobile suite was not rerun in this turn.** `tests/browser.mjs` and CI are included. The current environment lacks the required `control-browser` skill, and the Sites workflow prohibits using an improvised preview/browser path. No current claim of visual or end-to-end browser approval is made for this package. Previous prototype screenshots are not evidence for this revision.
- Supabase hosted project, real Auth tokens, actual PostgREST grants and production security/performance advisors.
- Real Tulane SSO, MFA, callback acceptance, provider signing/issuer checks, guest-account rejection, certificate rotation and session expiry.
- Vercel deployment, HTTPS/custom domain, cold starts and real network failures.
- iOS Safari/Android browsers, keyboard/screen-reader use and 200% zoom on the final deployed build.
- Independent penetration test, load test and recovery/backup drill.
- A fresh factual re-review of every OISS task/deadline. The existing checklist content and its recorded source dates have been preserved.

The browser suite uses a test-only Auth HTTP adapter and real embedded SQL/RLS. Even a passing browser suite cannot establish that Tulane SSO is integrated. It does not create a runtime authentication bypass in application code.

## Required staging acceptance before a real-student pilot

1. Deploy a staging app, apply migrations to a new staging Supabase project and run the hosted security/performance advisors.
2. Configure the IdP app with Tulane IT; use exact callback URLs and an approved test group. Do not use a user-supplied email suffix as authorization.
3. Sign in as two university-approved test users A and B. Confirm refresh, sign-out, interrupted login and denied access for an unapproved/guest identity.
4. Complete/update/clear a task as A, refresh and reopen on a second device. B must neither read nor alter A's rows, including direct API attempts with A's user_id.
5. Revoke or expire A's pilot membership while its session exists. Both application and database must deny access without waiting for token expiry.
6. Save in two tabs: an old revision must produce a visible conflict; a failed save must not display Saved. Test offline, unavailable database, expired session, retry and deliberate reset.
7. Verify `/demo` uses only sample data and cannot access online records. Legacy registration endpoints must remain absent from this package.
8. Check desktop/mobile layout, keyboard focus/dialog controls, screen-reader labels, 200% zoom and direct task links. Confirm Fall/Spring only and task-first layout.
9. Agree support contact, retention/deletion/backup policy, content owner, branding permissions and rollback plan with OISS/IT. Record results and only then expand to the agreed 5–10 pilot users.

Any failed security/access test blocks real-student use until corrected. The demo remains available independently.
