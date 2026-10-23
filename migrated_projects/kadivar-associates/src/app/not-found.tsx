import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SERVICES_DATA } from "@/lib/services-data";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] selection:bg-white/10 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center pt-32 px-6 pb-24 max-w-2xl mx-auto text-center">
        <p className="text-[#e6ff00] font-mono text-sm tracking-widest uppercase mb-4">Error 404</p>
        <h1 className="text-5xl md:text-7xl font-serif italic mb-6 text-white">Page Not Found.</h1>
        <p className="text-gray-400 text-lg mb-12">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <div className="w-full text-left bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white font-medium mb-4">Navigate to our Services:</h2>
          <ul className="space-y-3">
            {SERVICES_DATA.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-[#e6ff00] hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <Link href="/" className="mt-12 bg-white text-black px-8 py-4 rounded-full font-medium tracking-tight hover:bg-gray-200 transition-colors">
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
