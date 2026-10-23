

function WhoYouAreFunnel() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const options = [
    {
      id: 'startups',
      title: 'Scaling Startups',
      shortDesc: 'Seed to Series A structuring.',
      proof: 'Trusted by 25+ funded startups',
      painPoints: ['DPIIT Recognition & Angel Tax exemption', 'Complex ESOP & Cap Table structuring', 'Burn rate vs compliance balancing'],
      cta: 'Book Startup Consultation'
    },
    {
      id: 'sme',
      title: 'SME Manufacturers',
      shortDesc: 'Factory & supply chain compliance.',
      proof: 'Serving 40+ industrial clients',
      painPoints: ['CMA Data for working capital limits', 'GST ITC reconciliation & audits', 'Inventory & fixed asset verification'],
      cta: 'Book Industry Consultation'
    },
    {
      id: 'nri',
      title: 'Individuals / NRIs',
      shortDesc: 'Wealth protection & tax optimization.',
      proof: 'Managing 100+ HNI portfolios',
      painPoints: ['Capital Gains (Section 54) optimization', 'Double Taxation Avoidance Agreements (DTAA)', 'Scrutiny assessments & hassle-free ITR filing'],
      cta: 'Book Tax Strategy Call'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="text-center mb-16 relative z-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Tailored Solutions</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-white mb-4 tracking-tight">Who You Are</h2>
        <p className="text-white/60 font-sans text-base max-w-xl mx-auto">Select your profile to see how our expertise aligns with your exact challenges.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {options.map((opt) => {
          const isActive = activeTab === opt.id;
          return (
            <motion.div
              key={opt.id}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer ${isActive ? 'bg-zinc-900 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'}`}
              onClick={() => setActiveTab(isActive ? null : opt.id)}
            >
              <div className="p-8">
                <h3 className="text-2xl font-['Poppins'] font-bold text-white mb-2">{opt.title}</h3>
                <p className="text-white/50 text-sm font-sans mb-4">{opt.shortDesc}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`} />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40">{isActive ? 'Close details' : 'View details'}</span>
                </div>
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="px-8 pb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wide mb-6">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {opt.proof}
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">Pain Points Solved</p>
                        {opt.painPoints.map((pp, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                            <p className="text-sm font-sans text-white/80 leading-relaxed">{pp}</p>
                          </div>
                        ))}
                      </div>

                      <a 
                        href={`https://wa.me/919033440008?text=Hello%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(opt.title)}%20consultation.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-black font-sans font-bold text-sm hover:bg-emerald-400 hover:scale-[1.02] transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {opt.cta} <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// --- PROFESSIONAL EXPERIENCE & SECTORS ---
function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Track Record</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold tracking-tight mb-4 text-white">By The Numbers</h2>
        <p className="text-white/60 font-sans text-base max-w-xl mx-auto">
          Factual engagement experience driving compliance and financial growth across Rajkot and Gujarat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:grid-rows-2">
        {/* Metric 1 */}
        <div className="md:col-span-2 md:row-span-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col justify-between h-full">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">Since Inception</span>
             <div>
                <h3 className="text-6xl font-['Poppins'] font-extrabold text-white mb-2">8+</h3>
                <p className="text-xl font-sans text-emerald-400 font-semibold mb-2">Years of Practice</p>
                <p className="text-white/60 text-sm max-w-sm">Established in 2016, providing unwavering taxation and audit support.</p>
             </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="md:col-span-1 md:row-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
           <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-4 block">Assurance</span>
           <div>
              <h3 className="text-4xl font-['Poppins'] font-extrabold text-white mb-2">500+</h3>
              <p className="text-sm font-sans text-white/80 leading-relaxed">Statutory & Tax Audits executed flawlessly.</p>
           </div>
        </div>

        {/* Sector Focus */}
        <div className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-zinc-900 to-[#050505] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors">
           <h3 className="text-xl font-['Poppins'] font-bold text-white mb-6">Sector Expertise</h3>
           <div className="space-y-4 font-sans text-sm text-white/70">
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Manufacturing & Industrial</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Trading & Wholesale</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Service Sectors</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Petroleum Dealerships</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Startups & Corporate</span>
              </div>
           </div>
        </div>

        {/* Metric 3 */}
        <div className="md:col-span-1 md:row-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
           <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-4 block">Filing Accuracy</span>
           <div>
              <h3 className="text-4xl font-['Poppins'] font-extrabold text-emerald-400 mb-2">99%</h3>
              <p className="text-sm font-sans text-white/80 leading-relaxed">Zero-penalty compliance tracking.</p>
           </div>
        </div>

        {/* Philosophy quote */}
        <div className="md:col-span-2 md:row-span-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
           <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
           <p className="font-serif italic text-2xl text-white/90 mb-4 leading-tight relative z-10">
             "We believe in Growth Together. We see our growth as a reflection of the success of our clients."
           </p>
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10">
                 <img src="/harsh_avatar.png" alt="CA Harsh Manek" className="w-full h-full object-cover grayscale" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">CA Harsh Manek, Founder</span>
           </div>
        </div>
      </div>
    </section>
  );
}

// --- VERIFIED PROFESSIONAL TEAM ---
function TeamSection() {
  const team = [
    { name: "CA Harsh Manek", role: "Founder & FCA", spec: "Direct Tax & Audit" },
    { name: "Senior Associates", role: "Tax Professionals", spec: "GST & Compliance" },
    { name: "Audit Team", role: "Assurance", spec: "Statutory & Tax Audit" }
  ];
  return (
    <section id="team" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Our Core Strength</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-white mb-4 tracking-tight">Meet the Team</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <div key={i} className="relative group overflow-hidden rounded-3xl h-72 bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-colors">
            <img src="/harsh_avatar.png" alt={member.name} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 transition-opacity duration-700 object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 flex flex-col justify-end h-full opacity-90 group-hover:opacity-100 transition-opacity">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-2">{member.role}</p>
                <h3 className="text-2xl font-['Poppins'] font-bold text-white mb-1">{member.name}</h3>
                <p className="text-white/60 text-sm font-sans mb-4">Focus: {member.spec}</p>
                <button className="opacity-0 group-hover:opacity-100 w-full bg-white text-black py-2.5 rounded-xl font-bold font-sans text-sm hover:bg-emerald-400 transition-all duration-500 shadow-lg">Connect</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- PROFESSIONAL EXPERIENCE & SECTORS ---
function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Track Record</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold tracking-tight mb-4 text-white">By The Numbers</h2>
        <p className="text-white/60 font-sans text-base max-w-xl mx-auto">
          Factual engagement experience driving compliance and financial growth across Rajkot and Gujarat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:grid-rows-2">
        {/* Metric 1 */}
        <div className="md:col-span-2 md:row-span-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative z-10 flex flex-col justify-between h-full">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">Since Inception</span>
             <div>
                <h3 className="text-6xl font-['Poppins'] font-extrabold text-white mb-2">8+</h3>
                <p className="text-xl font-sans text-emerald-400 font-semibold mb-2">Years of Practice</p>
                <p className="text-white/60 text-sm max-w-sm">Established in 2016, providing unwavering taxation and audit support.</p>
             </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="md:col-span-1 md:row-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
           <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-4 block">Assurance</span>
           <div>
              <h3 className="text-4xl font-['Poppins'] font-extrabold text-white mb-2">500+</h3>
              <p className="text-sm font-sans text-white/80 leading-relaxed">Statutory & Tax Audits executed flawlessly.</p>
           </div>
        </div>

        {/* Sector Focus */}
        <div className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-zinc-900 to-[#050505] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors">
           <h3 className="text-xl font-['Poppins'] font-bold text-white mb-6">Sector Expertise</h3>
           <div className="space-y-4 font-sans text-sm text-white/70">
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Manufacturing & Industrial</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Trading & Wholesale</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Service Sectors</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Petroleum Dealerships</span>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                 <span>Startups & Corporate</span>
              </div>
           </div>
        </div>

        {/* Metric 3 */}
        <div className="md:col-span-1 md:row-span-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] transition-colors flex flex-col justify-between">
           <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-4 block">Filing Accuracy</span>
           <div>
              <h3 className="text-4xl font-['Poppins'] font-extrabold text-emerald-400 mb-2">99%</h3>
              <p className="text-sm font-sans text-white/80 leading-relaxed">Zero-penalty compliance tracking.</p>
           </div>
        </div>

        {/* Philosophy quote */}
        <div className="md:col-span-2 md:row-span-1 bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
           <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
           <p className="font-serif italic text-2xl text-white/90 mb-4 leading-tight relative z-10">
             "We believe in Growth Together. We see our growth as a reflection of the success of our clients."
           </p>
           <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10">
                 <img src="/harsh_avatar.png" alt="CA Harsh Manek" className="w-full h-full object-cover grayscale" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">CA Harsh Manek, Founder</span>
           </div>
        </div>
      </div>
    </section>
  );
}

// --- VERIFIED PROFESSIONAL TEAM ---
function TeamSection() {
  const team = [
    { name: "CA Harsh Manek", role: "Founder & FCA", spec: "Direct Tax & Audit" },
    { name: "Senior Associates", role: "Tax Professionals", spec: "GST & Compliance" },
    { name: "Audit Team", role: "Assurance", spec: "Statutory & Tax Audit" }
  ];
  return (
    <section id="team" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Our Core Strength</p>
        <h2 className="text-3xl md:text-5xl font-['Poppins'] font-extrabold text-white mb-4 tracking-tight">Meet the Team</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, i) => (
          <div key={i} className="relative group overflow-hidden rounded-3xl h-72 bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-colors">
            <img src="/harsh_avatar.png" alt={member.name} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 transition-opacity duration-700 object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 flex flex-col justify-end h-full opacity-90 group-hover:opacity-100 transition-opacity">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-2">{member.role}</p>
                <h3 className="text-2xl font-['Poppins'] font-bold text-white mb-1">{member.name}</h3>
                <p className="text-white/60 text-sm font-sans mb-4">Focus: {member.spec}</p>
                <button className="opacity-0 group-hover:opacity-100 w-full bg-white text-black py-2.5 rounded-xl font-bold font-sans text-sm hover:bg-emerald-400 transition-all duration-500 shadow-lg">Connect</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

