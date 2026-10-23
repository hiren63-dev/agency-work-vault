const fs = require('fs');

function fixImports(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Fix imports
  code = code.replace(
    /import { \n  Phone, MessageCircle, Clock, Download, Archive, RotateCcw, \n  X, Plus, Save, ChevronRight, Search, CheckCircle2, Trash2, Inbox\n} from 'lucide-react';/g,
    `import { 
  Phone, MessageCircle, Clock, Download, 
  X, Plus, Save, ChevronRight, Search, CheckCircle2, Trash2, Inbox, Loader2
} from 'lucide-react';`
  );
  
  // Add missing Loader2 to imports if not matched above
  if (!code.includes('Loader2')) {
    code = code.replace('Trash2, Inbox', 'Trash2, Inbox, Loader2');
  }

  // Use deletingId to show loader
  code = code.replace(
    /<Trash2 className="w-3.5 h-3.5" \/>/g,
    `{deletingId === lead.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}`
  );

  code = code.replace(
    /onClick=\{\(\) => handleDeleteLead\(lead\.id\)\}/g,
    `onClick={() => handleDeleteLead(lead.id)} disabled={deletingId === lead.id}`
  );

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed TS in:', filePath);
}

fixImports('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/portal/Leads.tsx');
fixImports('c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/portal/Leads.tsx');
