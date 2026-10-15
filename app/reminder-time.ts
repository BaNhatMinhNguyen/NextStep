export function deviceTimeZone(){return Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC";}
export function wallTime(iso:string,timeZone:string){
 const parts=new Intl.DateTimeFormat("en-CA",{timeZone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso));
 const get=(key:string)=>parts.find(p=>p.type===key)!.value;
 return {date:get("year")+"-"+get("month")+"-"+get("day"),time:get("hour")+":"+get("minute")};
}
export function wallTimeToUTC(date:string,time:string,timeZone:string){
 if(!/^\d{4}-\d\d-\d\d$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error("Choose a valid date and time.");
 const wanted=date+"T"+time,naive=Date.parse(wanted+":00Z");
 if(!Number.isFinite(naive)||new Date(naive).toISOString().slice(0,16)!==wanted)throw new Error("Choose a valid date and time.");
 const offsets=new Set<number>();
 for(const n of [-36,-12,0,12,36]){const instant=naive+n*3600000,display=wallTime(new Date(instant).toISOString(),timeZone);offsets.add(Date.parse(display.date+"T"+display.time+":00Z")-instant);}
 const matches=[...offsets].map(offset=>naive-offset).filter(instant=>{const display=wallTime(new Date(instant).toISOString(),timeZone);return display.date+"T"+display.time===wanted;});
 if(matches.length!==1)throw new Error("This time changes with daylight saving. Choose another time, such as 9:00 AM.");
 return new Date(matches[0]).toISOString();
}
function calendarEscape(value:string){return value.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");}
function fold(line:string){const encoder=new TextEncoder();let lines="",part="",bytes=0;for(const char of line){const n=encoder.encode(char).length;if(bytes+n>74){lines+=part+"\r\n";part=" ";bytes=1;}part+=char;bytes+=n;}return lines+part;}
export function calendarFile({id,title,at,link,source}:{id:string;title:string;at:string;link:string;source:string}){
 const stamp=(v:string)=>new Date(v).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
 return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//NextStep//Tulane student guide//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT","UID:"+id+"@nextstep-guide","DTSTAMP:"+stamp(new Date().toISOString()),"DTSTART:"+stamp(at),"DTEND:"+stamp(new Date(Date.parse(at)+15*60000).toISOString()),"SUMMARY:"+calendarEscape("NextStep: "+title),"DESCRIPTION:"+calendarEscape("Your personal reminder. Confirm official deadlines and instructions.\nOfficial guidance: "+source+"\nChecklist: "+link+"\nManage or delete this calendar event in Outlook. Independent student project. Not an official Tulane University product."),"URL:"+link,"BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-PT10M","DESCRIPTION:"+calendarEscape("NextStep: "+title),"END:VALARM","END:VEVENT","END:VCALENDAR"].map(fold).join("\r\n")+"\r\n";
}
export function downloadCalendar(input:Parameters<typeof calendarFile>[0]){
 const url=URL.createObjectURL(new Blob([calendarFile(input)],{type:"text/calendar;charset=utf-8"}));
 const anchor=document.createElement("a");anchor.href=url;anchor.download="nextstep-reminder.ics";document.body.appendChild(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
