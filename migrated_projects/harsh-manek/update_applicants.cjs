const fs = require('fs');

// 1. Update Applicants.tsx
const APPLICANTS_CODE = `import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Users, Loader2, Trash2, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const STATUS_STYLES: Record<string, string> = {
  pending:     'bg-yellow-500/10 text-yellow-600',
  reviewed:    'bg-blue-500/10 text-blue-600',
  shortlisted: 'bg-emerald-500/10 text-emerald-600',
  rejected:    'bg-red-500/10 text-red-600',
};

export default function Applicants() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applicants')
        .select('*, jobs(title)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setApplicants(data);
      }
    } catch (err) {
      console.warn('Could not fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await supabase.from('job_applicants').update({ status }).eq('id', id);
  };

  const deleteApplicant = async (id: string) => {
    if (!confirm('Are you sure you want to remove this applicant?')) return;
    setDeletingId(id);
    try {
      await supabase.from('job_applicants').delete().eq('id', id);
    } catch (err) {
      console.warn('Delete applicant failed:', err);
    } finally {
      setApplicants(prev => prev.filter(a => a.id !== id));
      setDeletingId(null);
    }
  };

  const filtered = applicants.filter(a =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">Applicants</h1>
        <p className="text-sm opacity-50 font-sans mt-1">Review candidates, download resumes, and manage submissions</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-[var(--background)] p-2 rounded-2xl border border-[var(--foreground)]/10 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 pl-11 pr-4 py-2 text-sm font-sans"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin opacity-40" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--foreground)]/20 rounded-3xl">
          <Users className="w-8 h-8 opacity-20 mx-auto mb-4" />
          <h3 className="font-bold text-lg opacity-60">No applicants yet</h3>
          <p className="text-sm opacity-40 mt-1">Applications submitted from the careers page will appear here.</p>
        </div>
      ) : (
        <div className="bg-[var(--background)] border border-[var(--foreground)]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans">
              <thead className="bg-black/5 border-b border-[var(--foreground)]/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Candidate</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Applied For</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider opacity-60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--foreground)]/5">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold mb-1">{app.name}</div>
                      <div className="flex items-center gap-3 text-xs opacity-60">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {app.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{app.jobs?.title ?? 'Talent Pool'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm opacity-70">
                      {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className={\`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 border-0 focus:outline-none focus:ring-0 cursor-pointer \${STATUS_STYLES[app.status] ?? STATUS_STYLES.pending}\`}
                        value={app.status ?? 'pending'}
                        onChange={e => updateStatus(app.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={\`\${app.name.replace(/\\s+/g, '_')}_Resume\`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-medium text-xs transition-colors"
                            title="View / Download Resume PDF"
                          >
                            <FileText className="w-3.5 h-3.5" /> View PDF
                          </a>
                        ) : (
                          <span className="text-xs opacity-30 font-sans mr-2">No file</span>
                        )}
                        <button
                          onClick={() => deleteApplicant(app.id)}
                          disabled={deletingId === app.id}
                          className="p-2 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                          title="Remove Applicant"
                        >
                          {deletingId === app.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
`;

for (const p of [
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/portal/Applicants.tsx',
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/portal/Applicants.tsx',
]) {
  fs.writeFileSync(p, APPLICANTS_CODE, 'utf8');
  console.log('Updated Applicants.tsx:', p);
}
