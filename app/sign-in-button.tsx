"use client";

import {useState, type FormEvent} from "react";

export default function SignInButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/auth/signin", {method: "POST", headers: {Accept: "application/json"}});
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") throw new Error("Sign-in could not be started. Please try again.");
      const url = new URL(result.url);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Sign-in is unavailable. Please try again later.");
      // Full-page navigation keeps the CSP form-action limited to this app.
      // The URL comes from the server's configured identity service.
      window.location.assign(url.href);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in is unavailable. Please try again.");
      setBusy(false);
    }
  }
  return <form onSubmit={signIn}>
    <button className="entry-primary" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Opening Tulane sign-in…" : "Sign in with Tulane"}</button>
    {error && <p role="alert" className="form-error">{error}</p>}
    <noscript><p>Enable JavaScript to open university sign-in.</p></noscript>
  </form>;
}
