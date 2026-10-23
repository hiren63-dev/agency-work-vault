const fs = require('fs');

const NEW_MODAL = `function ApplicationModal({ job, onClose }: { job: any; onClose: () => void }) {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [dragOver, setDragOver] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });

  const handleFile = (file: File | null) => {
    if (file && (file.type === 'application/pdf' || file.name.match(/\\.(pdf|doc|docx)$/i))) {
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
      const filename = Date.now() + '-' + form.name.replace(/\\s+/g, '-') + '.' + ext;
      let resumeUrl = '';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filename, resumeFile, { upsert: false });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filename);
        resumeUrl = urlData?.publicUrl ?? '';
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
          )}`;

for (const filePath of [
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-portfolio/src/pages/Careers.tsx',
  'c:/Users/zediz/OneDrive/Desktop/antigravity projects/harshmanek-preview/src/pages/Careers.tsx',
]) {
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');

  // Find the ApplicationModal function start and the closing }) after it
  const startIdx = code.indexOf('function ApplicationModal(');
  if (startIdx === -1) { console.warn('ApplicationModal not found in', filePath); continue; }

  // Find the end: the last two lines )} and }
  // We look for the closing of the entire function
  const endMarker = '\n}\n';
  const endIdx = code.lastIndexOf(endMarker);

  if (endIdx === -1 || endIdx <= startIdx) { console.warn('Could not find end of file in', filePath); continue; }

  const before = code.substring(0, startIdx);
  const after = '        </div>\n      </motion.div>\n    </div>\n  );\n}\n';

  code = before + NEW_MODAL + '\n' + after;
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated ApplicationModal in:', filePath);
}
