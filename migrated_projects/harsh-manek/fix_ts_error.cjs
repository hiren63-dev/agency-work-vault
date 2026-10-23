const fs = require('fs');

function fixType(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(
    /reader\.onloadend = \(\) => resolve\(reader\.result\);/,
    `reader.onloadend = () => resolve((reader.result as string) || '');`
  );
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed TS in:', filePath);
}

fixType('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/Careers.tsx');
fixType('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/Careers.tsx');
