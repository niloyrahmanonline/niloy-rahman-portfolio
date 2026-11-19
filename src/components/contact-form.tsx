"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/content";

export function ContactForm() {
  const [draft, setDraft] = useState("");
  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(data.get("subject")));
    const body = encodeURIComponent([data.get("message"), "", "From " + data.get("name"), data.get("email")].join("\n"));
    setDraft("mailto:" + profile.email + "?subject=" + subject + "&body=" + body);
  }

  return <form className="panel contact-form" method="post" onSubmit={prepareDraft} onChange={() => setDraft("")}>
    <h2>Draft an inquiry</h2>
    <p id="form-help">Prepare a draft here, then open your email app to send it.</p>
    <div className="form-row"><label>Name<input name="name" autoComplete="name" required maxLength={100} /></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={160} /></label></div>
    <label>Subject<input name="subject" required maxLength={140} /></label>
    <label>Message<textarea name="message" rows={5} required maxLength={1200} /></label>
    <button className="button button-primary" type="submit" aria-describedby="form-help">Prepare email</button>
    <div aria-live="polite">{draft && <a className="text-link" href={draft}>Open draft in email app</a>}</div>
  </form>;
}