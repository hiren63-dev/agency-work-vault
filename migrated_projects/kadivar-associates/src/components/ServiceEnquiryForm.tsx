"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { EnquiryFallback } from "./EnquiryFallback";

const FIELD_CLASS =
  "w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors";
const LABEL_CLASS =
  "block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2";

type Status = "idle" | "sending" | "sent" | "failed";

export function ServiceEnquiryForm({ serviceTitle }: { serviceTitle: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service: serviceTitle }),
      });

      if (!response.ok) {
        setStatus("failed");
        return;
      }

      track("Contact Form Submitted", { service: serviceTitle });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-lg border border-[#e6ff00]/40 bg-[#e6ff00]/10 px-5 py-6"
      >
        <p className="mb-2 font-medium text-white">
          Thank you — your enquiry about {serviceTitle} has been sent.
        </p>
        <p className="text-sm text-gray-400">
          We reply to every enquiry within one working day.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="service-name" className={LABEL_CLASS}>Name</label>
          <input type="text" id="service-name" name="name" className={FIELD_CLASS} required />
        </div>
        <div>
          <label htmlFor="service-email" className={LABEL_CLASS}>Email</label>
          <input type="email" id="service-email" name="email" className={FIELD_CLASS} required />
        </div>
      </div>
      <div>
        <label htmlFor="service-phone" className={LABEL_CLASS}>Phone (Optional)</label>
        <input type="tel" id="service-phone" name="phone" className={FIELD_CLASS} />
      </div>
      <div>
        <label htmlFor="service-message" className={LABEL_CLASS}>Message / Requirements</label>
        <textarea id="service-message" name="message" rows={4} className={FIELD_CLASS} />
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === "failed" && <EnquiryFallback />}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit Enquiry"}
      </button>

      <p className="text-xs leading-relaxed text-gray-500">
        Your details are used only to respond to this enquiry and are treated as
        confidential.
      </p>
    </form>
  );
}
