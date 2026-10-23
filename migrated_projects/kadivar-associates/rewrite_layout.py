import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

imports = """import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";"""

content = re.sub(r'import type \{ Metadata \}.*?import SmoothScroll from "@/components/SmoothScroll";', imports, content, flags=re.DOTALL)

metadata = """export const metadata: Metadata = {
  metadataBase: new URL('https://kadivar-redesign.vercel.app'),
  title: {
    default: "Chartered Accountants in Rajkot | GST, Audit & Tax | Kadivar & Associates",
    template: "%s | Kadivar & Associates"
  },
  description: "Kadivar & Associates is a firm of Chartered Accountants in Rajkot, Gujarat. We provide services in GST, statutory audit, and tax compliance.",
  openGraph: {
    title: 'Kadivar & Associates | Chartered Accountants in Rajkot',
    description: 'Services in GST, statutory audit, and tax compliance across Gujarat.',
    url: 'https://kadivar-redesign.vercel.app',
    siteName: 'Kadivar & Associates',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kadivar & Associates | Chartered Accountants in Rajkot',
    description: 'Services in GST, statutory audit, and tax compliance across Gujarat.',
    images: ['/og-image.jpg'],
  },
};"""

content = re.sub(r'export const metadata: Metadata = \{.*?\};', metadata, content, flags=re.DOTALL)

# Add <Footer /> before closing SmoothScroll
content = content.replace("</SmoothScroll>", "  <Footer />\n        </SmoothScroll>")

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
