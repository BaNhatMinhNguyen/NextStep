import { tasks, statuses, type Status, type Task } from "./data";
export type Profile = {level:string;visa:string;term:string;year:string;arrival:string;departure:string;moveIn:string;stage:number;submitted:string;programStart:string;addressChanged:string};
export type Reminder = {id:string;taskId:string;date:string;time:string;timeZone?:string};
export type Report = {id:string;taskId:string;reason:string;note:string;created:string};
export type State = {version:2;profile:Profile|null;statuses:Record<string,Status>;targets:Record<string,string>;reminders:Reminder[];reports:Report[]};
export const storageKey = "nextstep-tulane-guide-v2";
export const emptyState:State = {version:2,profile:null,statuses:{},targets:{},reminders:[],reports:[]};
export const defaultProfile:Profile = {level:"First-year undergraduate",visa:"F-1",term:"Fall",year:String(new Date().getFullYear()),arrival:"",departure:"",moveIn:"",stage:0,submitted:"",programStart:"",addressChanged:""};
export function localDate(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
export function validDate(s:unknown):s is string{if(typeof s!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+"T12:00:00");return !isNaN(d.getTime())&&localDate(d)===s;}
export function shift(s:string,n:number){if(!validDate(s))return "";const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return localDate(d);}
export function businessDays(s:string,n:number){if(!validDate(s))return "";let day=s;for(let i=0;i<n;){day=shift(day,1);const w=new Date(day+"T12:00:00").getDay();if(w!==0&&w!==6)i++;}return day;}
export function formatDate(s:string,year=false){return validDate(s)?new Date(s+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",...(year?{year:"numeric" as const}:{})}):"Date not set";}
export function statusOf(state:State,id:string):Status{return state.statuses[id]||"Not Started";}
export function done(state:State,id:string){return ["Completed","Not Applicable"].includes(statusOf(state,id));}
export function officialHealth(p:Profile|null){return p?.term==="Fall"&&p?.year==="2026"?"2026-07-15":"";}
export type Schedule = {date:string;kind:"Official deadline"|"Suggested target"|"Personal target"|"Check official deadline";target:string;message?:string;source?:string};
export function schedule(task:Task,state:State):Schedule{
 const p=state.profile, health=officialHealth(p), personal=state.targets[task.id]||"";
 let official="",suggested="",source="health";
 const fall2026=p?.term==="Fall"&&p.year==="2026";
 if(["orientation","orientation-inperson","checkin"].includes(task.id)&&fall2026){official="2026-08-12";source="orientationUndergrad";}
 if(task.id==="checkin"&&!fall2026&&p?.programStart){official=shift(p.programStart,30);source="status";}
 if(task.id==="maintain-status"&&p?.addressChanged){official=shift(p.addressChanged,10);source="status";}
 if(task.id==="health-submit")official=health;
 if(task.id==="wellness"&&p?.term==="Fall"&&p.year==="2026")official="2026-08-17";
 if(task.id==="health-records"){
   suggested=[health?shift(health,-56):"",p?.departure?shift(p.departure,-42):""].filter(Boolean).sort()[0]||(p?.arrival?shift(p.arrival,-56):"");
 }
 if(task.id==="health-vaccines")suggested=[health?shift(health,-42):"",p?.departure?shift(p.departure,-42):""].filter(Boolean).sort()[0]||"";
 if(task.id==="health-tb-risk")suggested=health?shift(health,-35):"";
 if(task.id==="health-tb-test")suggested=health?shift(health,-28):"";
 if(task.id==="health-submit")suggested=health?shift(health,-14):"";
 if(task.id==="health-check")suggested=p?.submitted?businessDays(p.submitted,5):"";
 if(task.id==="movein")suggested=p?.moveIn||"";
 if(task.offset!==undefined&&p?.arrival)suggested=shift(p.arrival,task.offset);
 const date=official||personal||suggested;
 return {date,source:official?source:undefined,kind:official?"Official deadline":personal||task.id==="movein"&&suggested?"Personal target":suggested?"Suggested target":"Check official deadline",target:personal||suggested,message:task.id==="health-check"&&suggested?"Five weekdays after your reported submission; campus holidays may affect review.":undefined};
}
export function actionable(t:Task,p:Profile|null){return (p?.stage||0)>=(t.readyAt||0);}
export function sortTasks(list:Task[],state:State,today=localDate()){
 const rank=(t:Task)=>{const s=schedule(t,state);if(done(state,t.id))return 10;if(s.kind==="Official deadline"&&s.date<today)return -2;if(s.kind==="Official deadline"&&s.date<=shift(today,14))return -1;return s.date?0:1;};
 const pr={Required:0,Conditional:1,Recommended:2};
 return [...list].sort((a,b)=>rank(a)-rank(b)||(schedule(a,state).date||"9999").localeCompare(schedule(b,state).date||"9999")||a.stage-b.stage||pr[a.priority]-pr[b.priority]||tasks.indexOf(a)-tasks.indexOf(b));
}
export function nextTask(state:State,today=localDate()):Task|undefined{
 if(!state.profile)return undefined;
 let available=tasks.filter(t=>!done(state,t.id)&&actionable(t,state.profile));
 const essential=available.filter(t=>t.stage<2);
 // A current official deadline (e.g. an address change) must not be hidden by arrival tasks.
 if(essential.length)available=available.filter(t=>t.stage<2||(schedule(t,state).kind==="Official deadline"&&schedule(t,state).date<=shift(today,14)));
 const ordered=sortTasks(available,state,today);
 function resolve(t:Task,seen=new Set<string>()):Task|undefined{
  if(seen.has(t.id))return undefined;seen.add(t.id);
  for(const id of t.dependencies||[]){if(!done(state,id)){const dep=tasks.find(x=>x.id===id);if(dep&&actionable(dep,state.profile))return resolve(dep,seen);}}
  return t;
 }
 return ordered[0]?resolve(ordered[0]):undefined;
}
export function progress(state:State){const applicable=tasks.filter(t=>statusOf(state,t.id)!=="Not Applicable");const completed=applicable.filter(t=>statusOf(state,t.id)==="Completed").length;return {completed,total:applicable.length,percent:applicable.length?Math.round(completed/applicable.length*100):0};}
export function changeStatus(state:State,id:string,status:Status):State{
 if(!tasks.some(t=>t.id===id)||!statuses.includes(status))return state;
 return {...state,statuses:{...state.statuses,[id]:status},reminders:["Completed","Not Applicable"].includes(status)?state.reminders.filter(r=>r.taskId!==id):state.reminders};
}
export function decodeState(raw:string):State{
 const v=JSON.parse(raw);if(v.version!==2)throw new Error("Unsupported saved plan");
 let profile:Profile|null=null;
 if(v.profile&&v.profile.level==="First-year undergraduate"&&v.profile.visa==="F-1"){
  profile={...defaultProfile,...v.profile};
  if(!["Fall","Spring"].includes(profile!.term))profile!.term="Fall";
  if(!/^20\d{2}$/.test(profile!.year))profile!.year="2026";
  profile!.stage=[0,1,2,3].includes(profile!.stage)?profile!.stage:0;
  for(const k of ["arrival","departure","moveIn","submitted","programStart","addressChanged"] as const)if(!validDate(profile![k]))profile![k]="";
 }
 const known=new Set(tasks.map(t=>t.id));
 const cleanStatuses:Record<string,Status>={},targets:Record<string,string>={};
 for(const [k,val] of Object.entries(v.statuses||{}))if(known.has(k)&&statuses.includes(val as Status))cleanStatuses[k]=val as Status;
 for(const [k,val] of Object.entries(v.targets||{}))if(known.has(k)&&validDate(val))targets[k]=val;
 const reminders=(Array.isArray(v.reminders)?v.reminders:[]).filter((r:Reminder)=>r&&typeof r.id==="string"&&known.has(r.taskId)&&validDate(r.date)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(r.time)&&!["Completed","Not Applicable"].includes(cleanStatuses[r.taskId])).map((r:Reminder)=>{let zone:string|undefined;try{if(typeof r.timeZone==="string"&&r.timeZone.length<80){new Intl.DateTimeFormat("en-US",{timeZone:r.timeZone});zone=r.timeZone;}}catch{}return {id:r.id,taskId:r.taskId,date:r.date,time:r.time,timeZone:zone};});
 const reports=(Array.isArray(v.reports)?v.reports:[]).filter((r:Report)=>r&&known.has(r.taskId)&&typeof r.note==="string"&&typeof r.reason==="string").map((r:Report)=>({...r,note:r.note.slice(0,500)}));
 return {version:2,profile,statuses:cleanStatuses,targets,reminders,reports};
}
