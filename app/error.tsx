"use client";
import EntryShell from "./entry-shell";
export default function ErrorPage({reset}:{reset:()=>void}){return <EntryShell><h1>Temporarily unavailable.</h1><p>Please retry in a moment. Your saved data has not been changed.</p><button className="entry-primary" onClick={reset}>Try again</button><a className="sso-demo-link" href="/">Back to sign in</a></EntryShell>;}
