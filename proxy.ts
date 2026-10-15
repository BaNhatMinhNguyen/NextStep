import {createServerClient} from "@supabase/ssr";
import {NextResponse,type NextRequest} from "next/server";

export async function proxy(request:NextRequest){
  let response=NextResponse.next({request});
  const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(url&&key&&request.cookies.getAll().some(c=>c.name.startsWith("sb-"))){
    const db=createServerClient(url,key,{cookieOptions:{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/"},cookies:{
      getAll:()=>request.cookies.getAll(),
      setAll(items,headers){
        items.forEach(({name,value})=>request.cookies.set(name,value));
        response=NextResponse.next({request});
        items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
        if(headers)Object.entries(headers).forEach(([name,value])=>response.headers.set(name,value));
      },
    }});
    try{await db.auth.getUser();}catch{/* Protected routes independently reject unverifiable sessions. */}
  }
  response.headers.set("Cache-Control","private, no-store, max-age=0");
  return response;
}
export const config={matcher:["/","/dashboard","/account","/auth/:path*","/api/:path*"]};
