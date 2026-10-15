"use client";

import {useEffect,useState} from "react";
import {Eye,EyeOff,LogIn,KeyRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter,DialogClose} from "@/components/ui/dialog";
import EntryShell from "./entry-shell";
import Experience from "./experience";

// Presentation state only. Never use this flag to authorize private routes or APIs.
const demoVisitKey="nextstep-demo-visit-v1";

export default function DemoAccess(){
 const [entered,setEntered]=useState(false),[showPassword,setShowPassword]=useState(false);
 useEffect(()=>{try{setEntered(sessionStorage.getItem(demoVisitKey)==="open");}catch{}},[]);
 function enter(){
  // No field values are read, submitted, logged, or saved.
  try{sessionStorage.setItem(demoVisitKey,"open");}catch{}
  setEntered(true);window.scrollTo(0,0);
 }
 function leave(){
  try{sessionStorage.removeItem(demoVisitKey);}catch{}
  setEntered(false);setShowPassword(false);window.scrollTo(0,0);
 }
 if(entered)return <Experience accountKey="public-demo" fullName="Demo student" demo onSignOut={leave}/>;
 return <EntryShell>
  <h1 className="sr-only">NextStep demo sign in</h1>
  <div className="demo-notice" id="demo-notice"><span>DEMO</span>Sample credentials only</div>
  <div className="demo-signin" aria-describedby="demo-notice" onKeyDown={e=>{if(e.key==="Enter"&&e.target instanceof HTMLInputElement){e.preventDefault();enter();}}}>
   <div className="demo-field"><Label htmlFor="demo-username">Username</Label><Input id="demo-username" value="demo.student" readOnly autoComplete="off" spellCheck={false} aria-describedby="demo-notice"/></div>
   <div className="demo-field"><Label htmlFor="demo-password">Password</Label><div className="demo-password">
    <Input id="demo-password" type={showPassword?"text":"password"} value="demo-password" readOnly autoComplete="off" aria-describedby="demo-notice"/>
    <Button type="button" className="demo-password-toggle" aria-label={showPassword?"Hide password":"Show password"} aria-controls="demo-password" aria-pressed={showPassword} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={22}/>:<Eye size={22}/>}</Button>
   </div></div>
   <Button type="button" className="demo-login" onClick={enter}><LogIn size={21}/>SIGN IN</Button>
   <Dialog>
    <DialogTrigger asChild><Button variant="link" className="demo-forgot"><KeyRound size={18}/>Forgot your password?</Button></DialogTrigger>
    <DialogContent className="demo-reset-dialog"><DialogHeader><DialogTitle>Demo account</DialogTitle><DialogDescription>Sample credentials are already filled in. Tulane sign-in and password reset are not connected yet.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button className="entry-primary">Back to sign in</Button></DialogClose></DialogFooter></DialogContent>
   </Dialog>
  </div>
 </EntryShell>;
}
