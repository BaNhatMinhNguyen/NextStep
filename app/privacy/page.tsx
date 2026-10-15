import EntryShell from "../entry-shell";
export default function Privacy(){return <EntryShell><h1>Your information.</h1><div className="privacy-copy">
  <p>NextStep is an independent student pilot, not an official Tulane service.</p>
  <h2>School sign-in</h2><p>When approved and configured, sign-in happens on the university identity provider. NextStep never asks for or stores your Tulane password. Only approved pilot accounts can access online checklists.</p>
  <h2>Online checklist</h2><p>Supabase stores your account identifier, profile dates, task progress, personal targets and information reports. Vercel runs the website. Project administrators have operational database access; other students cannot access your records.</p>
  <p>Do not enter passport numbers, SEVIS IDs, Social Security numbers, medical records or financial documents. Task completion is self-reported and is not sent to OISS or university systems.</p>
  <h2>Demo</h2><p>The separate demo uses fixed sample credentials and stores progress in this browser only. It cannot access online records.</p>
  <h2>Erase or export your data</h2><p>Under Sources &amp; about, export your checklist or reset its saved profile, progress and reports. Reset leaves only an empty checklist revision and your authentication account. Account removal, backup retention and support contacts must be finalized with the university before a real-student pilot. School sign-out here ends the NextStep session, not every university session.</p>
  <h2>Earlier prototype</h2><p>Existing registrations on the previous Sites prototype are not copied to this deployment.</p>
  </div><a className="entry-primary" href="/">Back to NextStep</a></EntryShell>;}
