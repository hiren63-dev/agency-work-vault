const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
fs.writeFileSync('tools_code.txt', lines.slice(655, 870).join('\n'));
