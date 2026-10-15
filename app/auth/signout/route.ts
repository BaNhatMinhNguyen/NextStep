import {NextResponse} from "next/server";
import {appOrigin,serverClient,configured,privateHeaders} from "@/lib/supabase";
import {isSameOrigin} from "@/lib/validation";
export async function POST(request:Request){
  if(!configured())return Response.json({error:"Not configured"},{status:503,headers:privateHeaders});
  const origin=appOrigin();
  if(!isSameOrigin(request,origin))return Response.json({error:"Invalid origin"},{status:403,headers:privateHeaders});
  try{const db=await serverClient();const {error}=await db.auth.signOut({scope:"local"});if(error)throw error;return NextResponse.redirect(origin+"/",{status:303,headers:privateHeaders});}
  catch{return Response.json({error:"Sign-out failed. Please retry."},{status:503,headers:privateHeaders});}
}
