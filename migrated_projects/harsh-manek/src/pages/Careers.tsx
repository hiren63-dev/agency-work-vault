import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, UploadCloud, CheckCircle2, Briefcase, Users, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";

const SPRING_SNAPPY = { type: "spring", stiffness: 400, damping: 30 } as any;

// Fallback logic for when Supabase table doesn't exist yet
const getLocalJobs = () => {
  const saved = localStorage.getItem('hm_mock_jobs');
  if (saved) return JSON.parse(saved);
  return [];
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>(() => {
    try {
      const local = JSON.parse(localStorage.getItem('hm_mock_jobs') || '[]');
      return local.filter((j: any) => j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false));
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

      const fetchJobs = async () => {
    try {
      let remoteJobs: any[] = [];
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteJobs = data;
      }

      const local = getLocalJobs();
      const map = new Map();

      // First add remote, then local
      [...remoteJobs, ...local].forEach((j: any) => {
        if (j && j.id && !map.has(j.id)) {
          const isOpen = j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false);
          if (isOpen) {
            map.set(j.id, j);
          }
        }
      });

      setJobs(Array.from(map.values()));
    } catch (err) {
      console.warn("Fetch jobs fallback:", err);
      const local = getLocalJobs().filter((j: any) => j.status === 'OPEN' || j.is_active === true || (!j.status && j.is_active !== false));
      setJobs(local);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job: any = null) => {
    setActiveJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-36 pb-24 px-6 max-w-[1200px] mx-auto relative z-10">
      
      {/* Split Layout Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Left Content */}
        <div>
          <h1 className="text-5xl sm:text-7xl font-['Poppins'] font-extrabold tracking-tight mb-6 leading-[1.1]">
            Build your <br/>future with us.
          </h1>
          <p className="text-lg sm:text-xl font-sans opacity-60 max-w-xl leading-relaxed mb-10">
            Join Harsh Manek & Co. and build a foundation in precision, ethics, and unparalleled financial strategy. We are always looking for exceptional talent.
          </p>

          {!loading && jobs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-50" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold mb-6 tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Accepting Open Applications
              </div>
              <h3 className="text-2xl font-['Poppins'] font-bold mb-3">We're always open to great talent.</h3>
              <p className="font-sans opacity-60 mb-8 text-sm leading-relaxed max-w-md">
                While we aren't hiring for specific roles at this moment, excellence is always welcome here. Drop your CV into our talent pool, and we'll reach out when a fitting opportunity arises.
              </p>
              <button 
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--foreground)] text-[var(--background)] font-sans font-bold text-sm hover:scale-105 transition-transform rounded-xl shadow-lg"
              >
                Join our Talent Pool <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {!loading && jobs.length > 0 && (
            <button 
              onClick={() => {
                document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--foreground)] text-[var(--background)] font-sans font-bold text-sm hover:scale-105 transition-transform rounded-xl shadow-lg"
            >
              View Open Positions <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Graphic - Abstract Floating UI Illustration */}
        <div className="relative h-[400px] sm:h-[500px] w-full flex items-center justify-center opacity-100">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 blur-[100px] rounded-full" />
          
          {/* Orbiting Rings */}
          <div className="absolute w-[280px] h-[280px] border border-[var(--foreground)]/[0.15] rounded-full" />
          <div className="absolute w-[420px] h-[420px] border border-[var(--foreground)]/[0.12] rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
          
          {/* Center Hub */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 w-32 h-32 rounded-[2rem] bg-[var(--foreground)]/[0.03] backdrop-blur-xl border border-[var(--foreground)]/20 shadow-2xl flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-[2rem]" />
            <Briefcase className="w-12 h-12 text-[var(--foreground)] opacity-90 relative z-10" />
          </motion.div>

          {/* Floating Element 1 - Team */}
          <motion.div 
            animate={{ y: [0, 15, 0], x: [0, 5, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-12 sm:top-20 right-12 sm:right-20 z-30 w-16 h-16 rounded-2xl bg-[var(--foreground)]/[0.03] backdrop-blur-xl border border-[var(--foreground)]/20 shadow-xl flex items-center justify-center"
          >
            <Users className="w-6 h-6 opacity-80" />
          </motion.div>

          {/* Floating Element 2 - Growth */}
          <motion.div 
            animate={{ y: [0, -15, 0], x: [0, -5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-12 sm:bottom-20 left-12 sm:left-20 z-30 w-20 h-20 rounded-[1.5rem] bg-[var(--foreground)]/[0.03] backdrop-blur-xl border border-[var(--foreground)]/20 shadow-xl flex items-center justify-center"
          >
            <TrendingUp className="w-8 h-8 opacity-80" />
          </motion.div>
        </div>
      </div>

      {/* Jobs List Section */}
      {!loading && jobs.length > 0 && (
        <div id="open-positions" className="pt-20 border-t border-[var(--foreground)]/10">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl sm:text-4xl font-['Poppins'] font-bold">Open Positions</h2>
            <span className="text-sm font-mono opacity-50 uppercase tracking-widest">{jobs.length} Role{jobs.length > 1 ? 's' : ''} Available</span>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => openModal(job)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-[var(--foreground)]/[0.02] border border-[var(--foreground)]/5 hover:border-[var(--foreground)]/20 rounded-3xl transition-all cursor-pointer"
              >
                <div>
                  <h3 className="text-2xl font-['Poppins'] font-bold mb-3 group-hover:text-emerald-500 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-widest opacity-50">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5"/> {job.department}</span>
                    <span className="hidden sm:inline">&middot;</span>
                    <span>{job.type}</span>
                    <span className="hidden sm:inline">&middot;</span>
                    <span>{job.experience}</span>
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
            
            <div className="pt-12 text-center">
               <p className="font-sans opacity-40 text-sm mb-6">Don't see a fit? We are always looking for exceptional talent.</p>
               <button 
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--foreground)]/20 hover:border-[var(--foreground)]/40 text-[var(--foreground)] font-sans font-semibold text-sm transition-all rounded-xl"
                >
                  Join Talent Pool
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ApplicationModal 
            job={activeJob} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicationModal({ job, onClose }: { job: any; onClose: () => void }) {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [dragOver, setDragOver] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });

  const handleFile = (file: File | null) => {
    if (file && (file.type === 'application/pdf' || file.name.match(/\.(pdf|doc|docx)$/i))) {
      setResumeFile(file);
    } else if (file) {
      alert('Please upload a PDF or Word document.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert('Please upload your resume.');
    setStatus("submitting");

    try {
      const ext = resumeFile.name.split('.').pop();
      const filename = Date.now() + '-' + form.name.replace(/\s+/g, '-') + '.' + ext;
      let resumeUrl = '';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filename, resumeFile, { upsert: false });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filename);
        resumeUrl = urlData?.publicUrl ?? '';
      }

      // Fail-safe backup: If storage upload returned empty or bucket not created, convert file to data URL
      if (!resumeUrl && resumeFile) {
        resumeUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.readAsDataURL(resumeFile);
        });
      }

      const { error: insertError } = await supabase.from('job_applicants').insert([{
        job_id: job?.id ?? null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        resume_url: resumeUrl,
        status: 'pending',
      }]);

      if (insertError) throw insertError;
      setStatus("success");
    } catch (err) {
      console.error('Application submit error:', err);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={SPRING_SNAPPY as any}
        className="relative w-full max-w-lg bg-[var(--background)] border border-[var(--foreground)]/10 shadow-2xl rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="overflow-y-auto flex-1 p-8 sm:p-10">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors">
            <X className="w-5 h-5 opacity-70" />
          </button>

          {status === "success" ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-['Poppins'] font-bold mb-2">Application Received</h3>
              <p className="font-sans opacity-60 text-sm">We'll review your profile and get back to you if there's a match.</p>
              <button onClick={onClose} className="mt-8 px-8 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] transition-colors font-sans text-sm font-semibold">Close</button>
            </div>
          ) : status === "error" ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-['Poppins'] font-bold mb-2">Submission Failed</h3>
              <p className="font-sans opacity-60 text-sm mb-6">Something went wrong. Please try again.</p>
              <button onClick={() => setStatus("idle")} className="px-6 py-3 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-sans text-sm font-semibold">Try Again</button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-['Poppins'] font-bold mb-2">{job ? "Apply for " + job.title : "Join Talent Pool"}</h2>
              <p className="font-sans opacity-50 text-sm mb-8">{job ? "Submit your details to apply for this role." : "Drop your CV below to be considered for future roles."}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-[var(--foreground)]/5 border border-transparent rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/40 transition-colors" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-[var(--foreground)]/5 border border-transparent rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/40 transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">Phone</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full bg-[var(--foreground)]/5 border border-transparent rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-emerald-500/40 transition-colors" placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">Resume / CV (PDF or Word)</label>
                  <label
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={"flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all " + (dragOver ? "border-emerald-500 bg-emerald-500/5 scale-[1.01]" : resumeFile ? "border-emerald-500/40 bg-emerald-500/5" : "border-[var(--foreground)]/15 hover:border-[var(--foreground)]/30 hover:bg-[var(--foreground)]/5")}
                  >
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
                    {resumeFile ? (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="font-sans text-sm font-semibold text-emerald-600 mb-1">{resumeFile.name}</p>
                        <p className="font-sans text-xs opacity-40">{(resumeFile.size / 1024).toFixed(0)} KB — click to change</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className={"w-8 h-8 mb-3 transition-opacity " + (dragOver ? "opacity-100 text-emerald-500" : "opacity-30")} />
                        <p className="font-sans text-sm font-semibold mb-1">Drop your file here</p>
                        <p className="font-sans text-xs opacity-40">or click to browse — PDF, DOC, DOCX</p>
                      </>
                    )}
                  </label>
                </div>

                <button type="submit" disabled={status === "submitting"}
                  className="w-full mt-4 h-14 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-sans font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === "submitting" ? (
                    <><div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  ) : "Submit Application"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
