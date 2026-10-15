import {configured,currentMember,appOrigin,privateHeaders} from "@/lib/supabase";
import {saveSchema,isSameOrigin,limitedBody} from "@/lib/validation";
export const dynamic="force-dynamic";
const respond=(body:unknown,status=200)=>Response.json(body,{status,headers:privateHeaders});
async function handle(request:Request,write=false){
  if(!configured())return respond({error:"Online storage is not configured."},503);
  if(write&&!isSameOrigin(request,appOrigin()))return respond({error:"Invalid request origin."},403);
  try{
    const {db,user,allowed}=await currentMember();
    if(!user)return respond({error:"Your session ended. Sign in again."},401);
    if(!allowed)return respond({error:"Your account does not have pilot access."},403);
    if(!write){
      const {data,error}=await db.rpc("load_checklist");
      if(error)return respond({error:"Your checklist could not be loaded. Please retry."},503);
      return respond(data);
    }
    if(!request.headers.get("content-type")?.startsWith("application/json"))return respond({error:"Expected JSON."},415);
    let raw:string;try{raw=await limitedBody(request);}catch(e){return respond({error:e instanceof RangeError?"Payload too large.":"Invalid request body."},e instanceof RangeError?413:400);}
    let json:unknown;try{json=JSON.parse(raw);}catch{return respond({error:"Invalid JSON."},400);}
    const parsed=saveSchema.safeParse(json);if(!parsed.success)return respond({error:"Check your dates and task details."},400);
    const {data,error}=await db.rpc("save_checklist",{expected_revision:parsed.data.revision,payload:parsed.data.state});
    if(error?.code==="40001")return respond({error:"This checklist changed in another tab or device. Reload before editing."},409);
    if(error)return respond({error:"Changes were not saved. Please retry."},503);
    return respond({revision:data});
  }catch{return respond({error:"The service is unavailable. Please retry."},503);}
}
export const GET=(request:Request)=>handle(request);
export const PUT=(request:Request)=>handle(request,true);
