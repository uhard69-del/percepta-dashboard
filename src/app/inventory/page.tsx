"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  ShieldCheck, 
  Zap,
  RefreshCw,
  Search,
  Target,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface License {
  id: string;
  key_hash: string;
  product_id: string;
  status: string;
  expires_at: string;
  product?: {
    name: string;
  }
}

export default function InventoryPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Member");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Member");
    const fetchMyLicenses = async () => {
      try {
        const res = await fetch(getApiUrl("/api/licenses/me"), {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setLicenses(data);
        }
      } catch (e) {
        console.error("Inventory fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyLicenses();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-white selection:bg-indigo-500/30">
      {/* Header */}
      <nav className="h-24 border-b border-zinc-900/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/store" className="p-1 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl flex items-center justify-center hover:border-indigo-500/30 transition-all">
                <img src="/logo.png" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" alt="PerceptaAI Logo" />
             </Link>
             <span className="text-xl font-black tracking-tighter uppercase italic">
                Secure<span className="text-indigo-500 italic">Vault</span>
             </span>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Authenticated Identity</span>
                <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{username}</span>
             </div>
             <Link href="/store" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:border-indigo-500/30 transition-all">Marketplace</Link>
             <button 
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
             >
                Terminate
             </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-20 px-8 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)] pointer-events-none" />
         <div className="max-w-[1400px] mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">Encrypted Storage Active</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Your Active <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 animate-gradient">Protocols</span>
            </h1>
         </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 pb-32">
         {loading ? (
            <div className="flex justify-center py-20">
                <RefreshCw className="w-10 h-10 text-zinc-800 animate-spin" />
            </div>
         ) : licenses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {licenses.map(lic => (
                    <div key={lic.id} className="group relative bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Zap className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <Package className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="text-right">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                    lic.status === "active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                )}>
                                    {lic.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter line-clamp-1">
                                {lic.product?.name || "Target Protocol"}
                            </h3>
                            <div className="p-4 bg-black border border-zinc-900 rounded-2xl font-mono text-[10px] text-zinc-400 break-all select-all flex items-center justify-between group/key transition-all hover:border-emerald-500/20">
                                <span>{lic.key_hash.slice(0, 16).toUpperCase()}...</span>
                                <ExternalLink className="w-3 h-3 opacity-30 group-hover/key:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-6 border-y border-zinc-900/50">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Time Remaining</span>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(lic.expires_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
            <div className="py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                <Package className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic mb-8">No active protocols detected in your neural bank</p>
                <Link href="/store" className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                    Visit Marketplace <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 w-full h-12 bg-black border-t border-zinc-900/50 backdrop-blur-xl flex items-center px-10 justify-between z-50">
        <div className="flex items-center gap-6">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Encrypted User Hub Terminal</span>
        </div>
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">© 2026 Percepta SecureVault</span>
      </div>
    </div>
  );
}
