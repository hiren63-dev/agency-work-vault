import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, Settings, LogOut, Menu, X, Smartphone, ArrowDownToLine, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function PortalLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner after 3 seconds if not dismissed
    const dismissed = localStorage.getItem('hm_pwa_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  useEffect(() => {
    // 1. Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // 2. Subscribe to Supabase for realtime new lead alerts
    const subscription = supabase
      .channel('realtime-leads-alert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          const newLead = payload.new;
          if ('Notification' in window && Notification.permission === 'granted') {
            const notif = new Notification(`New Lead: ${newLead.full_name}`, {
              body: `Service: ${newLead.service_requested}\nPhone: ${newLead.phone}`,
              icon: '/harsh_avatar.png',
            });
            notif.onclick = () => {
              window.focus();
              notif.close();
            };
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install on Mobile: Tap your browser menu (⋮ or Share icon) and select "Add to Home Screen".');
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('hm_pwa_dismissed', 'true');
  };

  const links = [
    { to: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/portal/leads', label: 'Leads Management', icon: Users },
    { to: '/portal/jobs', label: 'Careers (Jobs)', icon: Briefcase },
    { to: '/portal/applicants', label: 'Applicants', icon: FileText },
    { to: '/portal/website', label: 'Website Settings', icon: Globe },
    { to: '/portal/account', label: 'Account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-950 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h2 className="text-base font-['Poppins'] font-bold text-white leading-none">Harsh Manek</h2>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5 uppercase tracking-widest">Client Portal</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar / Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Responsive) */}
      <aside className={`
        fixed md:static top-0 bottom-0 left-0 z-50
        w-72 md:w-64 border-r border-white/10 p-6 flex flex-col bg-zinc-950 md:bg-transparent
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Brand Header */}
        <div className="mb-8 hidden md:block">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl font-['Poppins'] font-bold text-white">Harsh Manek</h2>
          </div>
          <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase pl-4">SECURE CLIENT PORTAL</p>
        </div>

        {/* Mobile Sidebar Close Header */}
        <div className="flex md:hidden items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Navigation</h2>
            <p className="text-xs text-white/40">Harsh Manek & Co.</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-white/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Install Mobile App Button in Sidebar */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={handleInstallApp}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-sans font-medium"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Install Mobile App</span>
            </div>
            <ArrowDownToLine className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden min-w-0">
        <Outlet />
      </main>

      {/* Floating PWA / App Install Popup Notification */}
      {showInstallBanner && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-zinc-950 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in flex items-start gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-0.5">Mobile Application</h4>
            <p className="text-xs text-white/80 font-sans leading-relaxed">
              Install the Harsh Manek Portal app for quick 1-tap home screen access.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstallApp}
                className="px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors flex items-center gap-1.5"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Install Now</span>
              </button>
              <button
                onClick={dismissBanner}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors text-xs"
              >
                Later
              </button>
            </div>
          </div>
          <button onClick={dismissBanner} className="text-white/40 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
