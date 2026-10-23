import re

with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'import { SERVICES_DATA } from "@/lib/services-data";',
    'import { SERVICES_DATA } from "@/lib/services-data";\nimport { siteConfig } from "@/lib/config";'
)

content = content.replace(
    'ICAI Firm Registration No: [TODO]<br />\n            CA Irfan Kadivar Membership No: [TODO]',
    '{siteConfig.firmRegistrationNo && <>ICAI Firm Registration No: {siteConfig.firmRegistrationNo}<br /></>}\n            {siteConfig.icaiMembershipNo && <>CA Irfan Kadivar Membership No: {siteConfig.icaiMembershipNo}</>}'
)

content = content.replace(
    '<p className="text-gray-400 text-sm mt-1">+91 [TODO]</p>',
    '{siteConfig.rajkotPhone && <p className="text-gray-400 text-sm mt-1">{siteConfig.rajkotPhone}</p>}', 1
)

content = content.replace(
    'Address Line 1,<br />Address Line 2,<br />Morbi [PIN]</p>\n              <p className="text-gray-400 text-sm mt-1">+91 [TODO]</p>',
    '{siteConfig.morbiAddress ? siteConfig.morbiAddress : "Morbi Office"}</p>\n              {siteConfig.morbiPhone && <p className="text-gray-400 text-sm mt-1">{siteConfig.morbiPhone}</p>}'
)

content = content.replace(
    'Address Line 1,<br />Address Line 2,<br />Wankaner [PIN]</p>\n              <p className="text-gray-400 text-sm mt-1">+91 [TODO]</p>',
    '{siteConfig.wankanerAddress ? siteConfig.wankanerAddress : "Wankaner Office"}</p>\n              {siteConfig.wankanerPhone && <p className="text-gray-400 text-sm mt-1">{siteConfig.wankanerPhone}</p>}'
)

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
