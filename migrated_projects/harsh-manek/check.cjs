const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
console.log('Has #050505:', content.includes('#050505'));
console.log('Has #f8f6f2:', content.includes('#f8f6f2'));
