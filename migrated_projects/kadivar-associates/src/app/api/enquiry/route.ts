import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  service?: string;
  company?: string; // honeypot — real users never fill this
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Silently accept honeypot submissions so bots do not learn they were caught.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? body.service ?? "General enquiry").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL || siteConfig.email;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  // Not configured yet. Report it honestly rather than pretending the
  // enquiry was delivered — the caller shows the phone/WhatsApp fallback.
  if (!apiKey || !from) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const html = `
    <h2>New website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone) || "Not provided"}</p>
    <p><strong>Regarding:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong><br>${escapeHtml(message) || "No message provided"}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Website enquiry — ${subject}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error("Resend rejected enquiry:", response.status, await response.text());
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Enquiry delivery threw:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
