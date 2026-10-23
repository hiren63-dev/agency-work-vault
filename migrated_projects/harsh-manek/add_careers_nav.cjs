const fs = require('fs');

function updateFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // 1. Desktop Nav: add Careers after Blog
  if (!content.includes('<Link to="/careers" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Careers</Link>')) {
    content = content.replace(
      /<Link to="\/blog" className="text-sm font-sans text-white\/60 hover:text-white transition-colors">Blog<\/Link>/,
      `<Link to="/blog" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Blog</Link>\n            <Link to="/careers" className="text-sm font-sans text-white/60 hover:text-white transition-colors">Careers</Link>`
    );
  }

  // 2. Mobile Menu: add Careers after Blog & Insights
  if (!content.includes('<Link to="/careers" className="text-lg font-sans text-white">Careers</Link>')) {
    content = content.replace(
      /<Link to="\/blog" className="text-lg font-sans text-white">Blog & Insights<\/Link>/,
      `<Link to="/blog" className="text-lg font-sans text-white">Blog & Insights</Link>\n                <Link to="/careers" className="text-lg font-sans text-white">Careers</Link>`
    );
  }

  fs.writeFileSync(path, content, 'utf8');
  console.log('Updated ' + path);
}

updateFile('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/App.tsx');
updateFile('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/App.tsx');
