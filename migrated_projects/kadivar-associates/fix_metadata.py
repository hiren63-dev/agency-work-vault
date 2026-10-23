import re

with open('src/app/services/[slug]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add generateMetadata
metadata_code = """import type { Metadata } from 'next';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.title} | Kadivar & Associates`,
    description: service.desc,
  };
}

export default function ServicePage"""

content = content.replace("export default function ServicePage", metadata_code)

with open('src/app/services/[slug]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
