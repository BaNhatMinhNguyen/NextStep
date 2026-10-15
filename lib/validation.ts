import {z} from "zod";
import {tasks, statuses} from "@/app/data";
import {validDate} from "@/app/model";

const day=z.string().refine(v=>v===""||/^20\d{2}-/.test(v)&&validDate(v),"Invalid date");
const profile=z.object({
  level:z.literal("First-year undergraduate"),visa:z.literal("F-1"),
  term:z.enum(["Fall","Spring"]),year:z.string().regex(/^20\d{2}$/),
  arrival:day,departure:day,moveIn:day,stage:z.number().int().min(0).max(3),
  submitted:day,programStart:day,addressChanged:day,
}).strict().refine(p=>!p.arrival||!p.departure||p.departure<=p.arrival,"Departure is after arrival")
  .refine(p=>!p.arrival||!p.moveIn||p.moveIn>=p.arrival,"Move-in is before arrival");
const taskId=z.string().refine(id=>tasks.some(t=>t.id===id),"Unknown task");
export const stateSchema=z.object({
  version:z.literal(2),profile:profile.nullable(),
  statuses:z.record(taskId,z.enum(statuses)),
  targets:z.record(taskId,day),reminders:z.array(z.never()).max(0),
  reports:z.array(z.object({id:z.string().uuid(),taskId,reason:z.enum(["Outdated instructions","Broken official link","Wrong deadline","Unclear information","Other"]),note:z.string().max(500),created:z.string().datetime()}).strict()).max(100),
}).strict().superRefine((s,ctx)=>{
  if(new Set(s.reports.map(r=>r.id)).size!==s.reports.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:"Duplicate report"});
  for(const [id,status] of Object.entries(s.statuses))if(status==="Not Applicable"&&tasks.find(t=>t.id===id)?.priority==="Required")ctx.addIssue({code:z.ZodIssueCode.custom,message:"Required tasks cannot be excluded"});
});
export const saveSchema=z.object({revision:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),state:stateSchema}).strict();
export function safeOrigin(value:string|undefined){
  if(!value)throw new Error("Missing NEXTSTEP_APP_ORIGIN");
  const url=new URL(value);
  if(url.username||url.password||url.pathname!=="/"||url.search||url.hash)throw new Error("Set an origin without a path");
  if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("HTTPS required");
  return url.origin;
}
export function isSameOrigin(request:Request,origin:string){return request.headers.get("origin")===origin&&request.headers.get("sec-fetch-site")!=="cross-site";}
export async function limitedBody(request:Request,limit=100000){
  if(Number(request.headers.get("content-length")||0)>limit)throw new RangeError("Payload too large");
  const reader=request.body?.getReader();if(!reader)return "";
  const parts:Uint8Array[]=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new RangeError("Payload too large");}parts.push(value);}}
  finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  return new TextDecoder("utf-8",{fatal:true}).decode(bytes);
}
