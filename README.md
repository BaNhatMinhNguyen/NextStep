# NextStep — Tulane SSO pilot preparation

Native Next.js 16 / React 19, Supabase Auth + PostgreSQL, ready for Vercel import.
Adapted from the existing NextStep Sites demo; reviewed on 2026-10-14. The live Sites demo
has not been overwritten. No existing student records or credentials are included.

## Run locally

Node >=22.13 and pnpm 11.25.0 (declared in package.json):

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000/demo`. It needs no database or ChatGPT account.
Production uses `pnpm build` then `pnpm start`. No Cloudflare bindings are needed.

## What is implemented

- Existing 32 tasks, short dashboard, To Do/Completed filters, Fall/Spring only,
  OISS images/contact details, task instructions and official links.
- `/demo`: fixed sample sign-in, local browser-only progress.
- `/`: university sign-in entry; explicitly unavailable until configured.
- `/auth/signin`, `/auth/callback`, `/auth/signout`: server-side Supabase PKCE
  flows for **SAML or Azure**, chosen only after Tulane IT confirms the provider.
  The application does not handle university passwords.
- The sign-in endpoint returns a validated HTTPS navigation URL, so the
  same-origin CSP form policy does not block a form redirect to the IdP.
- `/dashboard`, `/account`: verified session and active pilot membership required.
- `/api/checklist`: authenticated GET/PUT, strict input limits and validation,
  same-origin mutations, no-store responses, user identity taken from verified Auth.
- Postgres tables for checklist profiles, task state, information reports and
  read-only catalogue. RLS restricts each user's rows; membership expires/revokes.
- Atomic saves with revision conflict protection, explicit save status, retry,
  conflict recovery/export, per-task clear, account checklist reset and JSON export.
- CI for TypeScript, model/input/RLS tests, production build and browser tests.

The database membership lookup is a private, narrowly scoped SECURITY DEFINER
function behind a public SECURITY INVOKER wrapper. Exposed public functions do
not bypass RLS. Supabase dependencies are pinned and the lockfile is included.

## What is NOT live yet

Tulane has not provisioned an IdP application, approved the hosting/data plan, or
issued test identities. This code has not been deployed to a real Supabase project
or Vercel account in this session. The Auth browser tests use a local test adapter;
they do not prove university SSO works. See `docs/TEST-RESULTS.md`.

On 2026-10-14, TypeScript, 9 input/SSO unit tests, 38 embedded PostgreSQL
checks and the production build passed. The final package audit reported zero
known advisories. Browser/mobile tests were not rerun in the current environment;
see the documented verification limits before a real-student pilot.

## Deployment and university approval

1. `docs/DEPLOYMENT.md`: exact GitHub / database / Vercel / domain steps.
2. `docs/TULANE-SSO-BRIEF.md`: contacts, sponsor request, identity configuration,
   meeting questions and an English email draft.
3. `docs/TEST-RESULTS.md`: results and outstanding real-environment acceptance.

## Database

Apply `supabase/migrations/202610080001_checklists.sql`, then
`202610080002_catalog.sql`, to a **new staging Supabase project**. Never run the
test bootstrap against a real project: it defines stand-in Auth tables/roles only
inside an isolated in-memory PGlite instance. Supabase already owns those objects.

Runtime uses only the publishable key plus each user's session. There is no
service-role key in the application. `private.pilot_members` is managed manually
by an authorized project administrator after verifying each test user's immutable
Auth UUID and university identity. Self-reported email is not authorization.

## Test

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install --with-deps chromium
pnpm test:browser
```

Browser tests launch their own Next server on 3001 and a test-only Auth/PostgREST
adapter on 4545. Keep those ports free. An existing local browser can be selected
with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. On Linux,
`NEXTSTEP_BUNDLED_CHROMIUM=true pnpm test:browser` uses the packaged browser.
The adapter lives only in `tests/`; application code has no test-auth bypass.

## Deliberate boundaries

- User checklist state is synced, not official school records or task completion.
- Reports are saved privately; no email or OISS submission is sent automatically.
- Reset deletes the checklist's profile, task rows, targets and reports, retaining
  an empty revision marker and the authentication account. Administrator-led Auth
  account deletion cascades application records. Agree retention/backup policy
  before using real student data.
- Demo local storage is not imported into a real account.
- No old Sites registration/email records are migrated.
- The university must approve logo/image use and publication for a real pilot.
