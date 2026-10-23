import re

with open('src/app/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate the JSON-LD Script tag
json_ld = """        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AccountingService",
              "name": "Kadivar & Associates",
              "image": "https://kadivar-redesign.vercel.app/og-image.jpg",
              "@id": "https://kadivar-redesign.vercel.app",
              "url": "https://kadivar-redesign.vercel.app",
              "telephone": "+910000000000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Office 1108, R K World Tower, near Shital Park Chowk, 150 Feet Ring Road",
                "addressLocality": "Rajkot",
                "postalCode": "360006",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 22.3039,
                "longitude": 70.8022
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "10:00",
                "closes": "19:00"
              },
              "department": [
                {
                  "@type": "AccountingService",
                  "name": "Kadivar & Associates (Morbi)",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Morbi",
                    "addressCountry": "IN"
                  },
                  "telephone": "+910000000000"
                },
                {
                  "@type": "AccountingService",
                  "name": "Kadivar & Associates (Wankaner)",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Wankaner",
                    "addressCountry": "IN"
                  },
                  "telephone": "+910000000000"
                }
              ]
            })
          }}
        />
      </body>"""

content = content.replace("</body>", json_ld)

with open('src/app/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
