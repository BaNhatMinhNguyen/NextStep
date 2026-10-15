import {redirect} from "next/navigation";
import EntryShell from "../entry-shell";
import {configured,currentMember} from "@/lib/supabase";
export const dynamic="force-dynamic";
export default async function Account(){
  if(!configured())redirect("/?error=configuration");
  const {user,allowed}=await currentMember();
  if(!user)redirect("/?error=session");if(!allowed)redirect("/?error=access");
  return <EntryShell><h1>My account</h1><p className="account-email">{user.email}</p><p>Use Profile &amp; dates to update your checklist. You can erase its saved profile, progress and reports under Sources &amp; about.</p><a className="entry-primary" href="/dashboard">Back to checklist</a><form action="/auth/signout" method="post"><button className="sso-demo-link" type="submit">Sign out</button></form><a className="sso-privacy" href="/privacy">Privacy</a></EntryShell>;
}
