"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { SERVICES_DATA } from "@/lib/services-data";
import { EnquiryFallback } from "./EnquiryFallback";

const FIELD_CLASS =
  "w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e6ff00] focus-visible:ring-2 focus-visible:ring-[#e6ff00] transition-colors";
const LABEL_CLASS =
  "block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2";

type Status = "idle" | "sending" | "sent" | "failed";

export function ContactForm() {
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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setStatus("failed");
        return;
      }

      track("Contact Form Submitted");
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
        <p className="mb-2 font-medium text-white">Thank you — your enquiry has been sent.</p>
        <p className="text-sm text-gray-400">
          We reply to every enquiry within one working day. For anything urgent,
          please call or message us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contact-name" className={LABEL_CLASS}>Full Name</label>
        <input type="text" id="contact-name" name="name" className={FIELD_CLASS} required />
      </div>
      <div>
        <label htmlFor="contact-email" className={LABEL_CLASS}>Email</label>
        <input type="email" id="contact-email" name="email" className={FIELD_CLASS} required />
      </div>
      <div>
        <label htmlFor="contact-phone" className={LABEL_CLASS}>Phone (Optional)</label>
        <input type="tel" id="contact-phone" name="phone" className={FIELD_CLASS} />
      </div>
      <div>
        <label htmlFor="contact-subject" className={LABEL_CLASS}>Subject</label>
        <select
          id="contact-subject"
          name="subject"
          className={`${FIELD_CLASS} appearance-none`}
          required
          defaultValue=""
        >
          <option value="" disabled>Select a service</option>
          {SERVICES_DATA.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="Other enquiry">Other enquiry</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>Message</label>
        <textarea id="contact-message" name="message" rows={4} className={FIELD_CLASS} />
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
        className="w-full bg-[#e6ff00] text-black font-medium py-4 rounded-lg hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit Enquiry"}
      </button>

      <p className="text-xs leading-relaxed text-gray-500">
        Your details are used only to respond to this enquiry and are treated as
        confidential. Consultations available in Gujarati, Hindi and English.
      </p>
    </form>
  );
}
