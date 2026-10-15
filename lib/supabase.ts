import "server-only";
import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {safeOrigin} from "./validation";

export const privateHeaders={"Cache-Control":"private, no-store, max-age=0","Pragma":"no-cache","Vary":"Cookie"};
export function configured(){return !!(process.env.SUPABASE_URL&&process.env.SUPABASE_PUBLISHABLE_KEY&&process.env.NEXTSTEP_APP_ORIGIN);}
export function appOrigin(){return safeOrigin(process.env.NEXTSTEP_APP_ORIGIN);}
export async function serverClient(){
  if(!configured())throw new Error("Online service not configured");
  const jar=await cookies();
  return createServerClient(process.env.SUPABASE_URL!,process.env.SUPABASE_PUBLISHABLE_KEY!,{
    cookieOptions:{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/"},
    cookies:{getAll:()=>jar.getAll(),setAll(items){try{items.forEach(({name,value,options})=>jar.set(name,value,options));}catch{/* Server Components cannot write. Proxy owns refresh. */}}},
  });
}
export async function currentMember(){
  const db=await serverClient();
  const {data:{user},error}=await db.auth.getUser();
  if(error||!user)return {db,user:null,allowed:false};
  const {data:allowed,error:membershipError}=await db.rpc("has_pilot_access");
  if(membershipError)throw new Error("Membership service unavailable");
  return {db,user,allowed:allowed===true};
}
