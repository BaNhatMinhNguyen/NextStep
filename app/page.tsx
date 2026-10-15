import {redirect} from "next/navigation";
import EntryShell from "./entry-shell";
import {configured,currentMember} from "@/lib/supabase";
import {ssoMode} from "@/lib/sso";
import SignInButton from "./sign-in-button";
export const dynamic="force-dynamic";
export default async function Home({searchParams}:{searchParams:Promise<{error?:string}>}){
  const {error}=await searchParams;
  let available=configured()&&ssoMode(process.env)!==null;
  if(available){try{const {allowed}=await currentMember();if(allowed)redirect("/dashboard");}catch(e){if(e instanceof Error&&e.message.startsWith("NEXT_REDIRECT"))throw e;available=false;}}
  const messages:Record<string,string>={signin:"Sign-in could not be completed. Please try again.",access:"Your account is not in the NextStep pilot yet.",session:"Please sign in to continue.",configuration:"School sign-in is not connected yet."};
  return <EntryShell><span className="entry-eyebrow">NEXTSTEP</span><h1 className="sso-heading">Your next step.</h1>
    {error&&<p role="alert" className="form-error">{messages[error]||messages.signin}</p>}
    {available?<SignInButton/>:<p className="muted sso-unavailable">Tulane sign-in is awaiting university setup.</p>}
    <a className={available?"sso-demo-link":"entry-primary"} href="/demo">Try the demo</a><a className="sso-privacy" href="/privacy">Privacy</a>
  </EntryShell>;
}
