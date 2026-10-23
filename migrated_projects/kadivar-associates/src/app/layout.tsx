import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", style: ["normal", "italic"] });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kadivar-redesign.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Chartered Accountants in Rajkot | GST, Audit & Tax Filing | Kadivar & Associates",
    template: "%s | Kadivar & Associates"
  },
  description: "Kadivar & Associates provides statutory audit, tax structuring, direct tax litigation, and GST compliance services in Rajkot, Gujarat. Founded by CA Irfan Kadivar.",
  openGraph: {
    title: "Kadivar & Associates | Chartered Accountants in Rajkot",
    description: "Statutory audit, tax structuring, direct tax litigation, and GST compliance in Rajkot, Gujarat.",
    url: baseUrl,
    siteName: "Kadivar & Associates",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kadivar & Associates - Chartered Accountants",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kadivar & Associates | Chartered Accountants in Rajkot",
    description: "Statutory audit, tax structuring, direct tax litigation, and GST compliance in Rajkot, Gujarat.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: baseUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "Kadivar & Associates",
  "founder": {
    "@type": "Person",
    "name": siteConfig.partnerName,
    "jobTitle": siteConfig.partnerRole
  },
  "url": baseUrl,
  "logo": `${baseUrl}/og-image.jpg`,
  "image": `${baseUrl}/og-image.jpg`,
  "telephone": siteConfig.phoneRaw,
  "email": siteConfig.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": `${siteConfig.rajkotAddress.line1}, ${siteConfig.rajkotAddress.line2}`,
    "addressLocality": siteConfig.rajkotAddress.city,
    "addressRegion": siteConfig.rajkotAddress.state,
    "postalCode": siteConfig.rajkotAddress.pincode,
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.2895,
    "longitude": 70.7766
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "17:00"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
