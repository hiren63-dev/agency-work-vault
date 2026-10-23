const fs = require('fs');

const NEW_LEADS_TSX = `import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Phone, MessageCircle, Clock, Download, Archive, RotateCcw, 
  X, Plus, Save, ChevronRight, Search, CheckCircle2, Trash2, Inbox
} from 'lucide-react';

interface CustomField {
  key: string;
  value: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  service: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'CLOSED' | 'ARCHIVED';
  created_at: string;
  custom_fields?: Record<string, string> | CustomField[];
  [key: string]: any;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'NEW' | 'CONTACTED' | 'CLOSED' | 'ARCHIVED'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer & Editing State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [customFieldsList, setCustomFieldsList] = useState<CustomField[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [drawerSuccess, setDrawerSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setLeads(data as Lead[]);
      }
    } catch (err) {
      console.warn('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({ ...lead });
    let fieldsArray: CustomField[] = [];
    if (lead.custom_fields) {
      if (Array.isArray(lead.custom_fields)) fieldsArray = lead.custom_fields;
      else if (typeof lead.custom_fields === 'object') fieldsArray = Object.entries(lead.custom_fields).map(([k, v]) => ({ key: k, value: String(v) }));
    }
    setCustomFieldsList(fieldsArray);
    setNewKey('');
    setNewValue('');
    setDrawerSuccess(false);
  };

  const handleCloseDrawer = () => {
    setSelectedLead(null);
    setEditForm({});
    setCustomFieldsList([]);
  };

  const handleStatusChange = async (id: string, newStatus: 'NEW' | 'CONTACTED' | 'CLOSED' | 'ARCHIVED') => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      setEditForm(prev => ({ ...prev, status: newStatus }));
    }
    try { await supabase.from('leads').update({ status: newStatus }).eq('id', id); } catch (_) {}
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    setDeletingId(id);
    try {
      await supabase.from('leads').delete().eq('id', id);
      setLeads(prev => prev.filter(l => l.id !== id));
      if (selectedLead?.id === id) handleCloseDrawer();
    } catch (err) {
      console.warn('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddCustomField = () => {
    if (!newKey.trim()) return;
    setCustomFieldsList(prev => [...prev, { key: newKey.trim(), value: newValue.trim() }]);
    setNewKey('');
    setNewValue('');
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFieldsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setSavingDrawer(true);

    const customFieldsObj: Record<string, string> = {};
    customFieldsList.forEach(item => { if (item.key) customFieldsObj[item.key] = item.value; });

    const updatedData = {
      name: editForm.name || selectedLead.name,
      contact: editForm.contact || selectedLead.contact,
      service: editForm.service || selectedLead.service,
      message: editForm.message ?? selectedLead.message ?? '',
      status: editForm.status || selectedLead.status,
      custom_fields: customFieldsObj,
    };

    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...updatedData } : l));
    setSelectedLead(prev => prev ? { ...prev, ...updatedData } : null);

    try {
      await supabase.from('leads').update(updatedData).eq('id', selectedLead.id);
      setDrawerSuccess(true);
      setTimeout(() => setDrawerSuccess(false), 3000);
    } catch (_) {}
    setSavingDrawer(false);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const allKeysSet = new Set<string>(['id', 'created_at', 'name', 'contact', 'service', 'status', 'message']);
    leads.forEach(l => {
      if (l.custom_fields && typeof l.custom_fields === 'object') Object.keys(l.custom_fields).forEach(k => allKeysSet.add(\`custom_\${k}\`));
    });

    const headers = Array.from(allKeysSet);
    const csvRows = [
      headers.join(','),
      ...filteredLeads.map(lead => headers.map(header => {
        let val = header.startsWith('custom_') ? ((lead.custom_fields as any)?.[header.replace('custom_', '')] ?? '') : (lead[header] ?? '');
        return \`"\${String(val).replace(/"/g, '""')}"\`;
      }).join(','))
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\\uFEFF' + csvRows.join('\\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = \`harsh_manek_leads_\${new Date().toISOString().slice(0, 10)}.csv\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.message && lead.message.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (activeTab === 'ARCHIVED') return lead.status === 'ARCHIVED';
    if (activeTab === 'ACTIVE') return lead.status !== 'ARCHIVED';
    return lead.status === activeTab;
  });

  const activeCount = leads.filter(l => l.status !== 'ARCHIVED').length;
  const archivedCount = leads.filter(l => l.status === 'ARCHIVED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-['Poppins'] font-bold text-[var(--foreground)]">Leads Management</h1>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold">
              {activeCount} Active
            </span>
          </div>
          <p className="text-[var(--foreground)]/40 text-xs sm:text-sm mt-1">Real-time client enquiries, editing, archiving & CSV exports</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/15 text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-all text-xs font-sans font-medium">
            <Download className="w-4 h-4 text-emerald-500" /> <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl overflow-x-auto scrollbar-none shrink-0">
          {(['ACTIVE', 'NEW', 'CONTACTED', 'CLOSED', 'ARCHIVED'] as const).map(tab => {
            const count = tab === 'ARCHIVED' ? archivedCount : tab === 'ACTIVE' ? activeCount : leads.filter(l => l.status === tab).length;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={\`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5 \${activeTab === tab ? 'bg-[var(--foreground)] text-[var(--background)] font-bold shadow-md' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5'}\`}>
                <span>{tab}</span>
                <span className={\`text-[10px] px-1.5 py-0.5 rounded-full \${activeTab === tab ? 'bg-[var(--background)]/10 text-[var(--background)]' : 'bg-[var(--foreground)]/10 text-[var(--foreground)]/50'}\`}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[var(--foreground)]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name, phone, service..."
            className="w-full bg-transparent border border-[var(--foreground)]/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--foreground)] placeholder-[var(--foreground)]/30 outline-none focus:border-[var(--foreground)]/30 transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-[var(--foreground)]/40 font-mono text-sm bg-[var(--foreground)]/5 rounded-3xl border border-[var(--foreground)]/5 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading client enquiries...
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[var(--foreground)]/20 rounded-3xl bg-[var(--foreground)]/[0.02]">
          <Inbox className="w-10 h-10 opacity-20 mx-auto mb-4 text-[var(--foreground)]" />
          <h3 className="font-bold text-lg opacity-60 text-[var(--foreground)] font-sans">No leads yet</h3>
          <p className="text-sm opacity-40 mt-1 text-[var(--foreground)] font-sans max-w-sm mx-auto">When potential clients fill out the contact form on your website, their enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map(lead => {
            const cleanPhone = lead.contact.replace(/[^0-9+]/g, '');
            const waNumber = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone.startsWith('91') ? cleanPhone : \`91\${cleanPhone}\`;
            const isArchived = lead.status === 'ARCHIVED';

            return (
              <div key={lead.id} className={\`bg-[var(--background)] border transition-all rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[var(--foreground)]/20 group \${isArchived ? 'opacity-60 border-[var(--foreground)]/5 bg-[var(--foreground)]/5' : 'border-[var(--foreground)]/10 shadow-sm'}\`}>
                <div className="space-y-1.5 flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenDrawer(lead)}>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="font-sans font-bold text-[var(--foreground)] text-base group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                      <span>{lead.name}</span> <ChevronRight className="w-4 h-4 text-[var(--foreground)]/20 group-hover:translate-x-0.5 transition-transform" />
                    </h3>
                    <span className={\`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold \${lead.status === 'NEW' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : lead.status === 'CONTACTED' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : lead.status === 'CLOSED' ? 'bg-[var(--foreground)]/10 text-[var(--foreground)]/50 border border-[var(--foreground)]/10' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'}\`}>{lead.status}</span>
                    <span className="text-[11px] font-mono text-[var(--foreground)]/30 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-mono text-emerald-500 font-medium">{lead.service}</p>
                  {lead.message && <p className="text-xs text-[var(--foreground)]/60 font-sans line-clamp-2 leading-relaxed">{lead.message}</p>}
                  {lead.custom_fields && typeof lead.custom_fields === 'object' && Object.keys(lead.custom_fields).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(lead.custom_fields).map(([k, v]) => <span key={k} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)]/70"><strong className="text-[var(--foreground)]/40 font-normal">{k}:</strong> {String(v)}</span>)}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--foreground)]/5">
                  <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value as any)} className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/15 rounded-xl px-3 py-2 text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)]/30 cursor-pointer min-h-[38px]">
                    <option value="NEW">Status: NEW</option><option value="CONTACTED">Status: CONTACTED</option><option value="CLOSED">Status: CLOSED</option><option value="ARCHIVED">Status: ARCHIVED</option>
                  </select>
                  <a href={\`https://wa.me/\${waNumber}?text=\${encodeURIComponent(\`Hello \${lead.name}, thank you for reaching out to Harsh Manek & Co. regarding \${lead.service}.\`)}\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20 transition-colors text-xs font-sans font-medium min-h-[38px]">
                    <MessageCircle className="w-3.5 h-3.5" /><span className="hidden sm:inline">WhatsApp</span>
                  </a>
                  <a href={\`tel:\${cleanPhone}\`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/15 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/10 hover:text-[var(--foreground)] transition-colors text-xs font-sans font-medium min-h-[38px]">
                    <Phone className="w-3.5 h-3.5" /><span className="hidden sm:inline">Call</span>
                  </a>
                  <button onClick={() => handleDeleteLead(lead.id)} title="Delete Lead Permanently" className="p-2 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/15 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleOpenDrawer(lead)} className="px-3 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold text-xs hover:opacity-90 transition-colors min-h-[38px]">Edit / Details</button>
                </div>
              </div>
            );
          })}
          {filteredLeads.length === 0 && leads.length > 0 && <div className="p-16 text-center bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-2xl text-[var(--foreground)]/40 font-sans text-sm">No leads found matching "{activeTab}" filter.</div>}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="flex-1" onClick={handleCloseDrawer} />
          <div className="w-full max-w-xl bg-[var(--background)] border-l border-[var(--foreground)]/15 p-6 sm:p-8 flex flex-col h-full overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-[var(--foreground)]/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-semibold">Lead Details & Edit</span>
                <h2 className="text-xl sm:text-2xl font-['Poppins'] font-bold text-[var(--foreground)] mt-0.5">{selectedLead.name}</h2>
              </div>
              <button onClick={handleCloseDrawer} className="p-2 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:text-[var(--foreground)]"><X className="w-5 h-5" /></button>
            </div>

            {drawerSuccess && <div className="my-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 p-3.5 rounded-xl text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>Lead updated successfully!</span></div>}

            <form onSubmit={handleSaveDrawer} className="space-y-5 my-6 flex-1">
              <div><label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2">Full Name</label><input type="text" value={editForm.name || ''} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] text-sm outline-none focus:border-emerald-500/40" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2">Contact</label><input type="text" value={editForm.contact || ''} onChange={(e) => setEditForm(prev => ({ ...prev, contact: e.target.value }))} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] text-sm outline-none focus:border-emerald-500/40" /></div>
                <div><label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2">Lead Status</label><select value={editForm.status || 'NEW'} onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] text-sm outline-none focus:border-emerald-500/40 font-mono"><option value="NEW">NEW</option><option value="CONTACTED">CONTACTED</option><option value="CLOSED">CLOSED</option><option value="ARCHIVED">ARCHIVED</option></select></div>
              </div>
              <div><label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2">Requested Service</label><input type="text" value={editForm.service || ''} onChange={(e) => setEditForm(prev => ({ ...prev, service: e.target.value }))} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] text-sm outline-none focus:border-emerald-500/40" /></div>
              <div><label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2">Client Message</label><textarea rows={4} value={editForm.message || ''} onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))} className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] text-sm outline-none focus:border-emerald-500/40 resize-none" /></div>

              <div className="pt-4 border-t border-[var(--foreground)]/10">
                <div className="flex items-center justify-between mb-3"><h4 className="font-mono text-[11px] uppercase tracking-widest text-emerald-500 font-semibold">Custom Fields</h4><span className="text-[10px] text-[var(--foreground)]/30 font-mono">Schema-free key/value</span></div>
                <div className="space-y-2 mb-4">
                  {customFieldsList.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[var(--foreground)]/5 p-2.5 rounded-xl border border-[var(--foreground)]/10">
                      <input type="text" value={item.key} onChange={(e) => { const updated = [...customFieldsList]; updated[index].key = e.target.value; setCustomFieldsList(updated); }} placeholder="Field Label (e.g. PAN)" className="w-1/3 bg-transparent text-xs text-[var(--foreground)]/60 font-mono outline-none border-r border-[var(--foreground)]/10 pr-2" />
                      <input type="text" value={item.value} onChange={(e) => { const updated = [...customFieldsList]; updated[index].value = e.target.value; setCustomFieldsList(updated); }} placeholder="Value" className="flex-1 bg-transparent text-xs text-[var(--foreground)] outline-none" />
                      <button type="button" onClick={() => handleRemoveCustomField(index)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="New Field" className="w-1/3 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-emerald-500/40 font-mono" />
                  <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Field Value" className="flex-1 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-emerald-500/40" />
                  <button type="button" onClick={handleAddCustomField} className="px-3 py-2 rounded-xl bg-[var(--foreground)]/10 border border-[var(--foreground)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/20 transition-all text-xs font-medium flex items-center gap-1"><Plus className="w-3.5 h-3.5" /><span>Add</span></button>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--foreground)]/10 flex items-center justify-between gap-3">
                <button type="button" onClick={() => handleDeleteLead(selectedLead.id)} className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-medium flex items-center gap-2"><Trash2 className="w-4 h-4" /><span>Delete</span></button>
                <button type="submit" disabled={savingDrawer} className="flex-1 bg-[var(--foreground)] text-[var(--background)] font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-colors text-sm flex items-center justify-center gap-2"><Save className="w-4 h-4" /><span>{savingDrawer ? 'Saving...' : 'Save Lead Changes'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

for (const p of [
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/portal/Leads.tsx',
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/portal/Leads.tsx'
]) {
  fs.writeFileSync(p, NEW_LEADS_TSX, 'utf8');
  console.log('Fixed Leads page mock data in:', p);
}
