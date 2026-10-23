const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Replace dark hardcoded hex colors with corresponding light background variables or hex
content = content.replace(/#050505/g, '#f8f6f2');
content = content.replace(/#0a0a0a/g, '#f8f6f2');
content = content.replace(/#0d0d0d/g, '#fdfcfb'); // slightly lighter for cards

// 2. We want to remove `italic` from `font-serif italic` to keep it strictly clean and modern.
// Actually, DM Sans italic looks great, but let's just make sure there's no `font-serif` so everything uses `font-sans`.
content = content.replace(/font-serif/g, 'font-sans');
content = content.replace(/italic/g, ''); // just strip italic for maximum clean corporate feel

// 3. The WhatsApp button has `bg-[#25D366]`, that's fine (green).
// 4. The blob gradients: `bg-zinc-600/40` and `bg-slate-500/20` might look a bit muddy on warm white.
content = content.replace(/bg-zinc-600\/40/g, 'bg-amber-700/10');
content = content.replace(/bg-slate-500\/20/g, 'bg-orange-700/5');

// 5. Write back
fs.writeFileSync(appPath, content, 'utf8');
console.log('App.tsx theme modifications applied.');
