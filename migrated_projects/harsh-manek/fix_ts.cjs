const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix TypeScript errors
content = content.replace('const calcTax = (inc, regime) => {', 'const calcTax = (inc: number, regime: string) => {');
content = content.replace('let startTimestamp = null;', 'let startTimestamp: number | null = null;');
content = content.replace('const step = (timestamp) => {', 'const step = (timestamp: number) => {');
content = content.replace('const toggleDed = (index) => {', 'const toggleDed = (index: number) => {');

// Remove unused Lucide imports
content = content.replace('ChevronRight,', '');
content = content.replace('Calculator,', '');
content = content.replace('ExternalLink,', '');
content = content.replace('PieChart,', '');
content = content.replace('Wallet,', '');

fs.writeFileSync('src/App.tsx', content);
