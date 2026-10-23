const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const startIndex = content.indexOf("// --- INTERACTIVE TOOLS HUB ---");
const sub = content.substring(startIndex);
const lines = sub.split('\n');
lines.filter(l => l.startsWith('// ---')).forEach(l => console.log(l));
