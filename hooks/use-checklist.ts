"use client";
import {useEffect,useRef,useState,type SetStateAction} from "react";
import {decodeState,emptyState,defaultProfile,storageKey,type State} from "@/app/model";

export function useChecklist(accountKey:string,demo:boolean){
  const [state,setLocal]=useState<State>(emptyState),[loaded,setLoaded]=useState(false),[problem,setProblem]=useState("");
  const [sync,setSync]=useState(""),[attempt,setAttempt]=useState(0),[conflict,setConflict]=useState(false);
  const latest=useRef(state),ack=useRef(""),revision=useRef(0),running=useRef(false),active=useRef(true),blocked=useRef(false);
  const key=storageKey+":"+accountKey;
  function setState(update:SetStateAction<State>){
    if(!loaded||blocked.current)return;
    const next=typeof update==="function"?update(latest.current):update;
    latest.current=next;setLocal(next);
    if(!demo&&JSON.stringify(next)!==ack.current)setSync("Saving…");
  }
  useEffect(()=>{
    active.current=true;let cancelled=false;
    (async()=>{
      try{
        let initial:State;
        if(demo){const raw=localStorage.getItem(key);initial=raw?decodeState(raw):{...emptyState,profile:{...defaultProfile,year:"2026",arrival:"2026-08-10",moveIn:"2026-08-11",stage:3}};}
        else {const response=await fetch("/api/checklist",{cache:"no-store"});const result=await response.json();if(!response.ok)throw new Error(result.error||"Could not load your checklist.");initial=decodeState(JSON.stringify(result.state));revision.current=result.revision;}
        if(cancelled)return;
        latest.current=initial;ack.current=JSON.stringify(initial);setLocal(initial);setProblem("");setLoaded(true);setSync(demo?"":"Saved");
      }catch(e){if(!cancelled)setProblem(e instanceof Error?e.message:"Could not load your checklist.");}
    })();
    return()=>{cancelled=true;active.current=false;};
  },[accountKey,demo,key]);
  useEffect(()=>{
    if(!loaded)return;
    if(demo){try{localStorage.setItem(key,JSON.stringify(state));}catch{setProblem("This browser cannot save your demo progress.");}return;}
    if(blocked.current||running.current)return;
    const timer=setTimeout(async()=>{
      if(running.current||blocked.current)return;
      running.current=true;
      try{
        while(active.current&&JSON.stringify(latest.current)!==ack.current){
          const snapshot=JSON.stringify(latest.current);setSync("Saving…");
          const response=await fetch("/api/checklist",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({revision:revision.current,state:JSON.parse(snapshot)})});
          const result=await response.json();
          if(!response.ok){
            if(response.status===409){blocked.current=true;setConflict(true);}
            throw new Error(result.error||"Changes were not saved. Please retry.");
          }
          revision.current=result.revision;ack.current=snapshot;
        }
        if(active.current){setSync("Saved");setProblem("");}
      }catch(e){if(active.current){setSync("Not saved");setProblem(e instanceof Error?e.message:"Connection lost. Changes are still on this page. Retry before leaving.");}}
      finally{running.current=false;}
    },300);
    return()=>clearTimeout(timer);
  },[state,loaded,demo,key,attempt]);
  useEffect(()=>{
    if(demo)return;
    const warn=(e:BeforeUnloadEvent)=>{if(loaded&&JSON.stringify(latest.current)!==ack.current){e.preventDefault();e.returnValue="";}};
    window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);
  },[demo,loaded]);
  function retry(){if(!loaded)window.location.reload();else setAttempt(n=>n+1);}
  return {state,setState,loaded,problem,sync,conflict,retry};
}
