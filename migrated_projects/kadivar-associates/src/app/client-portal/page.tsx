import { BarChart3, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Mock auth check - in production this would verify an actual session
const isAuthenticated = false; 

export default function ClientPortal() {
  if (!isAuthenticated) {
    // Redirect unauthenticated users to a generic login or home
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="font-serif italic text-xl tracking-tight">Kadivar<span className="font-sans font-medium text-gray-400 not-italic text-sm ml-1">PORTAL</span></Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg text-white font-medium text-sm">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            Financial Overview
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg font-medium text-sm transition-colors">
            <FileText className="w-4 h-4" />
            Tax Documents
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium tracking-tight">Welcome, [Client Name]</h1>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full">
          <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-gray-400 mb-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Secure Portal
              </p>
              <h2 className="text-2xl font-serif italic mb-1">Document Repository</h2>
              <p className="text-gray-400 text-sm">Access your filed returns and compliance reports.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Pending Returns", value: "[0]", trend: "Status: Updated" },
              { label: "Documents Required", value: "[0]", trend: "Status: Complete" },
              { label: "Recent Uploads", value: "[0]", trend: "Status: Viewed" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                <p className="text-gray-400 text-sm font-medium mb-4">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-sans font-medium tracking-tighter tabular-nums">{stat.value}</p>
                  <p className="text-xs font-mono text-gray-400">{stat.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
