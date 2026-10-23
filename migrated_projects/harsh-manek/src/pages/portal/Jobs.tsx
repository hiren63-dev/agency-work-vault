import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, X, Clock, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SPRING = { type: 'spring', stiffness: 400, damping: 30 } as any;

const getLocalJobs = () => {
  try { return JSON.parse(localStorage.getItem('hm_mock_jobs') || '[]'); } catch { return []; }
};

const saveLocalJobs = (jobs: any[]) => {
  localStorage.setItem('hm_mock_jobs', JSON.stringify(jobs));
};

export default function JobsManager() {
  const [jobs, setJobs] = useState<any[]>(() => getLocalJobs());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Audit & Assurance',
    type: 'Full-Time',
    experience: '0-2 Years',
    location: 'Rajkot, Gujarat',
    description: ''
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      let remoteJobs: any[] = [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) remoteJobs = data;

      const local = getLocalJobs();
      const map = new Map();
      [...remoteJobs, ...local].forEach((j: any) => {
        if (j?.id && !map.has(j.id)) map.set(j.id, j);
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn('Portal fetch jobs fallback:', err);
      setJobs(getLocalJobs());
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description) return alert('Title and Description are required.');
    setSaving(true);

    const newJob = {
      id: crypto.randomUUID(),
      ...formData,
      requirements: [],
      status: 'OPEN',
      is_active: true,
      created_at: new Date().toISOString()
    };

    const updatedLocal = [newJob, ...getLocalJobs().filter((j: any) => j.id !== newJob.id)];
    saveLocalJobs(updatedLocal);

    try {
      const { error } = await supabase.from('jobs').insert([newJob]);
      if (error) console.warn('Supabase insert notice:', error);
    } catch (err) {
      console.warn('Supabase insert failed, local saved:', err);
    } finally {
      setJobs(prev => [newJob, ...prev.filter(j => j.id !== newJob.id)]);
      setSaving(false);
      setIsEditorOpen(false);
      setFormData({ title: '', department: 'Audit & Assurance', type: 'Full-Time', experience: '0-2 Years', location: 'Rajkot, Gujarat', description: '' });
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Remove this job posting? This cannot be undone.')) return;
    setDeletingId(jobId);
    try {
      await supabase.from('jobs').delete().eq('id', jobId);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    } finally {
      const updated = jobs.filter(j => j.id !== jobId);
      setJobs(updated);
      saveLocalJobs(updated);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[var(--foreground)] tracking-tight">Careers & Jobs</h1>
          <p className="text-sm text-[var(--foreground)] opacity-50 font-sans mt-1">Manage active listings and talent pool</p>
        </div>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-sans font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </button>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin opacity-40" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--foreground)]/20 rounded-3xl">
          <Briefcase className="w-8 h-8 opacity-20 mx-auto mb-4" />
          <h3 className="font-bold text-lg opacity-60">No jobs posted yet</h3>
          <p className="text-sm opacity-40 mt-1">Click "Post New Job" to add your first listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-[var(--background)] border border-[var(--foreground)]/10 rounded-2xl p-6 relative group hover:border-[var(--foreground)]/20 transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--foreground)]/5 text-[var(--foreground)] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 opacity-70" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${job.status === 'OPEN' || job.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {job.status ?? 'OPEN'}
                  </span>
                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all duration-200"
                    title="Remove job"
                  >
                    {deletingId === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg font-sans mb-1">{job.title}</h3>
              <p className="text-sm font-sans opacity-50 mb-6">{job.department} · {job.type}</p>

              <div className="pt-5 border-t border-[var(--foreground)]/10 flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 opacity-40">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-sans">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Drawer */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={SPRING}
              className="w-full max-w-xl h-full bg-[var(--background)] border-l border-[var(--foreground)]/10 shadow-2xl flex flex-col rounded-3xl sm:rounded-none overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[var(--foreground)]/10 flex justify-between items-center bg-[var(--background)]">
                <h2 className="text-lg font-bold font-sans">Create Job Posting</h2>
                <button onClick={() => setIsEditorOpen(false)} className="p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors">
                  <X className="w-5 h-5 opacity-60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50"
                    placeholder="e.g. Tax Manager"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Department</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50">
                      <option>Audit & Assurance</option>
                      <option>Taxation</option>
                      <option>Corporate Advisory</option>
                      <option>Administration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Type</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50">
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship (Article)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Experience</label>
                    <select value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50">
                      <option>0-2 Years</option>
                      <option>2-5 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Location</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Job Description *</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/50 resize-none"
                    placeholder="Enter full job responsibilities and requirements..." />
                </div>
              </div>

              <div className="p-6 border-t border-[var(--foreground)]/10 bg-[var(--background)] flex justify-end gap-3">
                <button onClick={() => setIsEditorOpen(false)} className="px-5 py-2.5 rounded-xl font-sans font-bold text-sm hover:bg-[var(--foreground)]/5 transition-colors">Cancel</button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-sans font-bold text-sm shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Publish Job'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
