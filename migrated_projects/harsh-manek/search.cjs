const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
lines.forEach((l,i) => {
  if (l.toLowerCase().includes('calculator') || l.toLowerCase().includes('tools')) {
    console.log(i+1 + ': ' + l.trim());
  }
});
