import {appOrigin,serverClient,configured,privateHeaders} from "@/lib/supabase";
import {isSameOrigin} from "@/lib/validation";
import {safeAuthRedirect,ssoMode} from "@/lib/sso";
export async function POST(request:Request){
  if(!configured()||!ssoMode(process.env))return Response.json({error:"School sign-in is not configured."},{status:503,headers:privateHeaders});
  try{
    const origin=appOrigin();
    if(!isSameOrigin(request,origin))return Response.json({error:"Invalid origin"},{status:403,headers:privateHeaders});
    const db=await serverClient(),mode=ssoMode(process.env);
    const redirectTo=origin+"/auth/callback";
    const result=mode==="saml"&&process.env.NEXTSTEP_SAML_PROVIDER_ID
      ?await db.auth.signInWithSSO({providerId:process.env.NEXTSTEP_SAML_PROVIDER_ID,options:{redirectTo,skipBrowserRedirect:true}})
      :mode==="azure"?await db.auth.signInWithOAuth({provider:"azure",options:{scopes:"email",redirectTo,skipBrowserRedirect:true}}):null;
    if(!result||result.error||!result.data?.url)throw new Error("Identity service unavailable");
    // URL is returned by our configured Auth service, never a user-supplied return URL.
    return Response.json({url:safeAuthRedirect(result.data.url)},{headers:privateHeaders});
  }catch{return Response.json({error:"Sign-in could not be started. Please try again."},{status:503,headers:privateHeaders});}
}
