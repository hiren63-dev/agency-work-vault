import { siteConfig } from "@/lib/config";

/**
 * Shown when the enquiry could not be delivered. Never leaves the visitor
 * without a route to the firm — the whole point of the form is contact.
 */
export function EnquiryFallback() {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
      <p className="mb-3">
        We could not send your enquiry just now. Please reach us directly — we
        reply to every message.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`tel:${siteConfig.phoneRaw}`}
          className="rounded-md bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-gray-200"
        >
          Call {siteConfig.phone}
        </a>
        <a
          href={`https://wa.me/${siteConfig.phoneRaw.replace("+", "")}?text=Hello%2C%20I%20have%20an%20enquiry`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10"
        >
          WhatsApp
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-md border border-white/20 px-4 py-2 font-medium text-white transition-colors hover:bg-white/10"
        >
          {siteConfig.email}
        </a>
      </div>
    </div>
  );
}
