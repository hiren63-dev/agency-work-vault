import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    new: 0,
    contacted: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('status');
        
      if (!error && data) {
        setMetrics({
          new: data.filter(l => l.status === 'NEW').length,
          contacted: data.filter(l => l.status === 'CONTACTED').length,
          total: data.length
        });
      }
    } catch (err) {
      console.warn('Failed to fetch dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-['Poppins'] font-bold text-[var(--foreground)]">Client Portal Overview</h1>
        <p className="text-[var(--foreground)]/40 text-sm mt-1">Harsh Manek & Co. Private Admin Workspace</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[var(--background)] border border-[var(--foreground)]/10 p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-500">New Enquiries</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-4xl font-extrabold text-[var(--foreground)] font-['Poppins'] tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-[var(--foreground)]/30" /> : metrics.new}
          </p>
          <p className="text-xs text-[var(--foreground)]/40 font-sans mt-2">Needs follow-up</p>
        </div>

        <div className="bg-[var(--background)] border border-[var(--foreground)]/10 p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-blue-500">Contacted</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-4xl font-extrabold text-[var(--foreground)] font-['Poppins'] tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-[var(--foreground)]/30" /> : metrics.contacted}
          </p>
          <p className="text-xs text-[var(--foreground)]/40 font-sans mt-2">Proposal / CMA under discussion</p>
        </div>

        <div className="bg-[var(--background)] border border-[var(--foreground)]/10 p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--foreground)]/50">Total Leads</span>
            <span className="p-2 rounded-xl bg-[var(--foreground)]/5 text-[var(--foreground)]/60">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-4xl font-extrabold text-[var(--foreground)] font-['Poppins'] tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-[var(--foreground)]/30" /> : metrics.total}
          </p>
          <p className="text-xs text-[var(--foreground)]/40 font-sans mt-2">All time enquiries</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link 
          to="/portal/leads"
          className="group bg-[var(--background)]/80 border border-[var(--foreground)]/10 hover:border-emerald-500/30 hover:bg-[var(--foreground)]/[0.02] p-6 rounded-3xl transition-all block relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold font-sans text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">Manage Enquiries →</h3>
            <ArrowRight className="w-4 h-4 text-[var(--foreground)]/40 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-[var(--foreground)]/50 leading-relaxed font-sans">
            Review incoming consultation requests, change client status, and trigger WhatsApp or phone calls directly.
          </p>
        </Link>

        <Link 
          to="/portal/website"
          className="group bg-[var(--background)]/80 border border-[var(--foreground)]/10 hover:border-blue-500/30 hover:bg-[var(--foreground)]/[0.02] p-6 rounded-3xl transition-all block relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold font-sans text-[var(--foreground)] group-hover:text-blue-500 transition-colors">Website Controlled Settings →</h3>
            <ArrowRight className="w-4 h-4 text-[var(--foreground)]/40 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-[var(--foreground)]/50 leading-relaxed font-sans">
            Update phone number, WhatsApp contact, business email, and office address without touching code.
          </p>
        </Link>
      </div>
    </div>
  );
}
