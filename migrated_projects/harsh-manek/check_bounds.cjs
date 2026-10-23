const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// I will write a regex or a simple string slice to replace ToolsHub and the 4 components.
const startMarker = "// --- INTERACTIVE TOOLS HUB ---";
const endMarker = "// --- TESTIMONIALS SECTION ---"; // Let's check if this exists or something similar.
console.log('Has start:', content.includes(startMarker));
console.log('Has end:', content.includes(endMarker));

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf("// --- LEGAL/PAGES SECTION ---"); // or footer
console.log('StartIndex:', startIndex);
console.log('EndIndex:', endIndex);

