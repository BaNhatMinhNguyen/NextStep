import {redirect} from "next/navigation";
import Experience from "../experience";
import {configured,currentMember} from "@/lib/supabase";
export const dynamic="force-dynamic";
export default async function Dashboard(){
  if(!configured())redirect("/?error=configuration");
  const {user,allowed}=await currentMember();
  if(!user)redirect("/?error=session");
  if(!allowed)redirect("/?error=access");
  return <Experience key={user.id} accountKey={user.id} fullName={user.user_metadata?.full_name||user.email||"My account"}/>;
}
