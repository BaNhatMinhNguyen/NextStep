import {NextResponse} from "next/server";
import {appOrigin,configured,serverClient,privateHeaders} from "@/lib/supabase";
export async function GET(request:Request){
  if(!configured())return Response.json({error:"Not configured"},{status:503,headers:privateHeaders});
  const origin=appOrigin(),params=new URL(request.url).searchParams;
  try{
    const code=params.get("code");
    if(!code||params.has("error"))return NextResponse.redirect(origin+"/?error=signin",{status:303,headers:privateHeaders});
    const db=await serverClient();
    const {error}=await db.auth.exchangeCodeForSession(code);
    if(error)return NextResponse.redirect(origin+"/?error=signin",{status:303,headers:privateHeaders});
    const {data:{user},error:userError}=await db.auth.getUser();
    const {data:allowed,error:membershipError}=await db.rpc("has_pilot_access");
    if(userError||!user||membershipError||allowed!==true){await db.auth.signOut({scope:"local"});return NextResponse.redirect(origin+"/?error=access",{status:303,headers:privateHeaders});}
    return NextResponse.redirect(origin+"/dashboard",{status:303,headers:privateHeaders});
  }catch{return NextResponse.redirect(origin+"/?error=signin",{status:303,headers:privateHeaders});}
}
