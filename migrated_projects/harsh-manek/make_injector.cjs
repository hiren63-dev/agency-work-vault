const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf("// --- INTERACTIVE TOOLS HUB ---");
const endIndex = content.indexOf("// --- FAQ ---");

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newToolsCode = `// --- INTERACTIVE TOOLS HUB ---
function ToolsHub() {
  return (
    <section id="tools" className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-4">Financial Utilities</p>
        <h2 className="text-3xl sm:text-4xl font-sans tracking-tight mb-4">The Tax Sandbox</h2>
        <p className="text-white/40 font-sans text-base max-w-xl mx-auto">Interactive tools to help you strategize pricing, calculate true take-home pay, and avoid penalties.</p>
      </div>
      
      <div className="space-y-12">
        <TaxSandbox />
        <InvoiceStrategist />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PenaltySimulator />
          <DocumentChecklist />
        </div>
      </div>
    </section>
  );
}

function TaxSandbox() {
  const [income, setIncome] = useState("1200000");
  const [deductions, setDeductions] = useState([
    { id: '80c', name: '80C Investments (PPF, ELSS)', max: 150000, active: false, desc: 'Max limit ₹1.5L' },
    { id: '80ccd', name: 'NPS (Pension System)', max: 50000, active: false, desc: 'Extra ₹50k under 80CCD(1B)' },
    { id: '80d', name: 'Health Insurance', max: 75000, active: false, desc: 'Up to ₹75k limit' },
    { id: '24b', name: 'Home Loan Interest', max: 200000, active: false, desc: 'Up to ₹2L limit' }
  ]);
  const [animatedTakehome, setAnimatedTakehome] = useState(0);

  const numGross = parseInt(income.replace(/[^0-9]/g, "")) || 0;
  
  const calcTax = (inc, regime) => {
    if(regime === 'new') {
      if (inc <= 300000) return 0;
      if (inc <= 700000) return 0; // Rebate
      if (inc <= 1000000) return 20000 + (inc - 700000) * 0.10;
      if (inc <= 1200000) return 50000 + (inc - 1000000) * 0.15;
      if (inc <= 1500000) return 80000 + (inc - 1200000) * 0.20;
      return 110000 + (inc - 1500000) * 0.30;
    } else {
      if (inc <= 250000) return 0;
      if (inc <= 500000) return 0; 
      if (inc <= 1000000) return 12500 + (inc - 500000) * 0.20;
      return 112500 + (inc - 1000000) * 0.30;
    }
  };

  const stdDed = 50000;
  const customDed = deductions.filter(d => d.active).reduce((sum, d) => sum + d.max, 0);
  
  const taxNew = calcTax(Math.max(0, numGross - stdDed), 'new') * 1.04;
  const taxOld = calcTax(Math.max(0, numGross - stdDed - customDed), 'old') * 1.04;
  
  const isOldBetter = taxOld < taxNew;
  const finalTax = isOldBetter ? taxOld : taxNew;
  const takeHome = numGross - finalTax;

  useEffect(() => {
    // Simple interpolation for smooth number rolling
    let start = animatedTakehome;
    const end = takeHome;
    if (start === end) return;
    const duration = 400;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 5);
      setAnimatedTakehome(start + (end - start) * easeOut);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [takeHome]);

  const taxPct = numGross > 0 ? (finalTax / numGross) * 100 : 0;
  const takePct = numGross > 0 ? 100 - taxPct : 0;

  const toggleDed = (index) => {
    const newDed = [...deductions];
    newDed[index].active = !newDed[index].active;
    setDeductions(newDed);
  };

  return (
    <div className="glass-card p-6 md:p-8 lg:p-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div>
            <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Your Exact Annual Income</label>
            <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-emerald-500 transition-colors pb-2">
              <span className="text-4xl md:text-5xl text-white/40 mr-2 tabular-nums">₹</span>
              <input 
                type="text" 
                inputMode="numeric"
                value={income}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
                  setIncome(val === 0 ? "" : val.toLocaleString('en-IN'));
                }}
                className="w-full bg-transparent border-none text-4xl md:text-5xl font-bold tabular-nums text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-semibold">Tax Saving Strategies</h3>
                <p className="text-xs text-white/40 mt-1">Toggle investments to simulate savings.</p>
              </div>
            </div>
            <div className="space-y-2">
              {deductions.map((d, i) => (
                <div key={d.id} onClick={() => toggleDed(i)} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">{d.name}</div>
                    <div className="text-xs text-white/40 font-mono mt-0.5">{d.desc}</div>
                  </div>
                  <div className={"w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ml-4 " + (d.active ? "bg-emerald-500" : "bg-white/10")}>
                    <div className={"absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md " + (d.active ? "translate-x-6" : "translate-x-0")}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
          <p className="text-white/50 text-sm mb-1">True Take-Home Pay</p>
          <div className="text-5xl md:text-6xl font-bold text-emerald-400 tabular-nums tracking-tighter mb-8">
            ₹{Math.round(animatedTakehome).toLocaleString('en-IN')}
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-emerald-400">Take Home ({takePct.toFixed(1)}%)</span>
              <span className="text-red-400">Tax ({taxPct.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: \`\${takePct}%\` }}></div>
              <div className="h-full bg-red-500 transition-all duration-500" style={{ width: \`\${taxPct}%\` }}></div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-3 font-mono text-xs mb-6">
            <div className="flex justify-between text-white/60"><span>Gross Income</span><span>₹{numGross.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-500/80"><span>Deductions</span><span>- ₹{(stdDed + (isOldBetter ? customDed : 0)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/60 pt-2 border-t border-white/10"><span>Taxable Income</span><span>₹{Math.max(0, numGross - stdDed - (isOldBetter ? customDed : 0)).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-red-400 pt-2"><span>Tax Payable</span><span>- ₹{Math.round(finalTax).toLocaleString('en-IN')}</span></div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
              {customDed === 0 
                ? (taxNew === 0 ? "Your income is fully tax-exempt under the New Regime." : "Toggle investments to see if you can increase your take-home pay under the Old Regime.")
                : (isOldBetter ? \`By utilizing these deductions, shifting to the Old Regime saves you ₹\${Math.round(taxNew - taxOld).toLocaleString('en-IN')} this year!\` : \`Even with deductions, the New Regime is still better, saving you ₹\${Math.round(taxOld - taxNew).toLocaleString('en-IN')}.\`)}
            </p>
            <a href={WA_BASE} target="_blank" className="block text-center w-full bg-white text-black font-semibold rounded-lg py-3 text-sm hover:scale-[1.02] transition-transform shadow-lg">
              Consult Harsh to execute this plan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceStrategist() {
  const [target, setTarget] = useState("100000");
  const [gstRate, setGstRate] = useState(18);
  const [hasTds, setHasTds] = useState(false);

  const numTarget = parseInt(target.replace(/[^0-9]/g, "")) || 0;
  
  const base = hasTds ? (numTarget / 0.9) : numTarget;
  const gstAmt = (base * gstRate) / 100;
  const totalInvoice = base + gstAmt;
  const tdsAmt = hasTds ? (base * 0.10) : 0;
  const clientPays = totalInvoice - tdsAmt;
  const netCash = clientPays - gstAmt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6 md:p-8 flex flex-col justify-center">
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-4">I want to pocket exactly:</label>
        <div className="relative flex items-center border-b-2 border-white/20 focus-within:border-purple-500 transition-colors pb-2 mb-8">
          <span className="text-3xl md:text-4xl text-white/40 mr-2 tabular-nums">₹</span>
          <input 
            type="text" 
            inputMode="numeric"
            value={target}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
              setTarget(val === 0 ? "" : val.toLocaleString('en-IN'));
            }}
            className="w-full bg-transparent border-none text-3xl md:text-4xl font-bold tabular-nums text-white outline-none"
          />
        </div>
        
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-3">GST Rate</label>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 flex-wrap">
          {[0, 5, 12, 18, 28].map(r => (
            <button key={r} onClick={() => setGstRate(r)} className={\`flex-1 py-2 rounded-lg text-sm transition-colors \${gstRate === r ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold' : 'text-white/40 hover:text-white'}\`}>
              {r}%
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl cursor-pointer hover:bg-white/[0.04] transition-colors" onClick={() => setHasTds(!hasTds)}>
          <div>
            <div className="text-sm font-medium text-white">Client deducts 10% TDS?</div>
            <div className="text-xs text-white/40 font-mono mt-0.5">Section 194J (Professional)</div>
          </div>
          <div className={"w-12 h-6 rounded-full relative transition-colors duration-300 shrink-0 ml-4 " + (hasTds ? "bg-purple-500" : "bg-white/10")}>
            <div className={"absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md " + (hasTds ? "translate-x-6" : "translate-x-0")}></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-0 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none"></div>
        <div className="p-8 pb-4 flex-1">
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
            <div>
              <h4 className="font-serif italic text-2xl text-white">Invoice Strategy</h4>
              <p className="text-[10px] font-mono text-white/30 uppercase mt-1">To achieve your target profit</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">Draft</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm tabular-nums">
            <div className="flex justify-between text-white/80 font-semibold text-base"><span>Base Service Fee</span><span>₹{Math.round(base).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/50 pl-4"><span>+ CGST ({gstRate/2}%)</span><span>₹{Math.round(gstAmt/2).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-white/50 pl-4"><span>+ SGST ({gstRate/2}%)</span><span>₹{Math.round(gstAmt/2).toLocaleString('en-IN')}</span></div>
          </div>
          <div className="border-t border-dashed border-white/20 mt-6 pt-4 flex justify-between items-end">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Total Invoice Value</span>
            <span className="text-3xl font-sans font-bold text-white tabular-nums">₹{Math.round(totalInvoice).toLocaleString('en-IN')}</span>
          </div>

          <div className="mt-6 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs tabular-nums">
            <div className="flex justify-between text-white/60 mb-2"><span>Client pays you</span><span className="text-white">₹{Math.round(clientPays).toLocaleString('en-IN')}</span></div>
            {hasTds && <div className="flex justify-between text-red-400/80 mb-2"><span>Client holds TDS</span><span>- ₹{Math.round(tdsAmt).toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between text-red-400/80 mb-2"><span>You pay GST</span><span>- ₹{Math.round(gstAmt).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/10 font-bold text-sm mt-3"><span>Net Cash in Pocket</span><span>₹{Math.round(netCash).toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PenaltySimulator() {
  const [delay, setDelay] = useState(0);
  const min = -30, max = 150, range = 180;
  const deadlinePct = (Math.abs(min) / range) * 100;
  const val = delay;
  
  const pct = ((val - min) / range) * 100;
  const fillPct = val > 0 ? (val / range) * 100 : 0;
  
  const d = new Date(2026, 6, 31); 
  d.setDate(d.getDate() + val);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const fFee = val > 0 ? 5000 : 0;
  const aFee = val > 0 ? 100000 * 0.01 * Math.ceil(val / 30) : 0;
  const total = fFee + aFee;

  let mascotEmoji = "https://em-content.zobj.net/source/apple/391/relieved-face_1f60c.png";
  let mascotText = "We are safe!";
  let mascotClass = "animate-[float_3s_ease-in-out_infinite]";
  let mascotScale = 1;

  if (val > 0) {
    const intensity = val / 150;
    if (val <= 30) {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/worried-face_1f61f.png";
      mascotText = "Uh oh... missed it.";
      mascotScale = 1 + (intensity * 0.3);
    } else if (val <= 90) {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/anxious-face-with-sweat_1f630.png";
      mascotText = "Interest piling up!";
      mascotClass = "animate-[jiggle_1s_ease-in-out_infinite]";
      mascotScale = 1 + (intensity * 0.5);
    } else {
      mascotEmoji = "https://em-content.zobj.net/source/apple/391/face-screaming-in-fear_1f631.png";
      mascotText = "File it now!!";
      mascotClass = "animate-[panic_0.2s_infinite]";
      mascotScale = 1;
    }
  }

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-center relative overflow-visible">
      <style dangerouslySetInnerHTML={{__html: \`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
        @keyframes jiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg) scale(1.1); } }
        @keyframes panic { 0%, 100% { transform: translate(0,0) scale(1.3); } 25% { transform: translate(-3px,-3px) scale(1.3) rotate(-8deg); } 75% { transform: translate(3px,3px) scale(1.3) rotate(8deg); } }
      \`}} />
      
      <div className="absolute -top-10 right-4 z-50 flex flex-col items-center">
        <div className="bg-white text-black px-3 py-1.5 rounded-xl text-xs font-bold font-sans shadow-xl mb-2 relative transition-all duration-300">
          {mascotText}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-solid border-white border-b-transparent border-l-transparent border-r-transparent"></div>
        </div>
        <div className="transition-transform duration-100 ease-out" style={{ transform: \`scale(\${mascotScale})\` }}>
          <img src={mascotEmoji} alt="Mascot" className={\`w-14 h-14 drop-shadow-xl \${mascotClass}\`} />
        </div>
      </div>

      <div className="flex justify-between items-end mb-12 mt-6 relative z-10">
        <div>
          <h3 className="font-semibold text-lg">Penalty Simulator</h3>
          <p className="text-xs font-mono text-white/40 mt-1 uppercase tracking-widest">ITR AY 2026-27</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50 mb-1">{val <= 0 ? "Safe zone." : \`Losing money (\${val} days late)\`}</p>
          <div className={\`text-3xl font-bold tabular-nums tracking-tighter transition-colors duration-300 \${val <= 0 ? 'text-emerald-400' : 'text-red-400'}\`}>
            ₹{total.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="relative w-full h-6 flex items-center mb-12">
        <div className="w-full h-6 bg-white/10 rounded-full relative">
          <div className="absolute left-0 h-full bg-emerald-500 rounded-l-full" style={{ width: \`\${deadlinePct}%\` }}></div>
          <div className="absolute h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-r-full shadow-[0_0_15px_rgba(239,68,68,0.4)]" style={{ left: \`\${deadlinePct}%\`, width: \`\${fillPct}%\` }}></div>
          <div className="absolute top-[-5px] bottom-[-5px] w-0.5 bg-white z-10" style={{ left: \`\${deadlinePct}%\` }}>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded uppercase whitespace-nowrap">Jul 31</div>
          </div>
        </div>
        
        <input 
          type="range" min={min} max={max} value={delay} onChange={(e) => setDelay(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-grab active:cursor-grabbing z-20"
        />
        <div className="absolute w-8 h-8 bg-white rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg border-[3px] border-black z-15 pointer-events-none transition-colors" style={{ left: \`\${pct}%\`, borderColor: val <= 0 ? '#111' : '#ef4444' }}></div>
        <div className="absolute -bottom-8 px-2 py-1 bg-black border border-white/20 rounded-lg text-xs font-mono tabular-nums transition-all" style={{ left: \`\${pct}%\`, transform: 'translateX(-50%)' }}>
          {dateStr}
        </div>
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-2 font-mono text-xs tabular-nums mb-6">
        <div className="flex justify-between text-white/60"><span>Late Fee (Sec 234F)</span><span>₹{fFee.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-white/60"><span>Interest (Sec 234A)</span><span>₹{aFee.toLocaleString('en-IN')}</span></div>
      </div>
      <a href={WA_BASE} target="_blank" className={\`block text-center w-full font-semibold rounded-lg py-3 text-sm hover:scale-[1.02] transition-transform \${val <= 0 ? 'bg-white text-black' : 'bg-red-500 text-white'}\`}>
        {val <= 0 ? "File ITR Now Before Deadline" : "Stop the penalty - File Now"}
      </a>
    </div>
  );
}

// Document Checklist
function DocumentChecklist() {
`;

fs.writeFileSync('inject_tools.cjs', `
const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = content.indexOf("// --- INTERACTIVE TOOLS HUB ---");
const endIndex = content.indexOf("// --- FAQ ---");

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

// We need to keep the DocumentChecklist body that exists in the old code, so we'll grab it.
const docChecklistStart = content.indexOf("function DocumentChecklist()");
const faqStart = endIndex;
const docChecklistCode = content.substring(docChecklistStart, faqStart);

const finalCode = before + \`${newToolsCode}\` + docChecklistCode.substring(docChecklistCode.indexOf('{') + 1) + after;

fs.writeFileSync('src/App.tsx', finalCode);
console.log('Successfully injected React tools into App.tsx');
`);
