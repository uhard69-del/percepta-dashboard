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
  ExternalLink,
  History,
  Info,
  Key as KeyIcon,
  ShoppingBag,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface License {
  id: string;
  key_hash: string;
  key_string?: string;
  product_id: string;
  status: string;
  expires_at: string;
  created_at: string;
  product?: {
    name: string;
  }
}

export default function InventoryPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Member");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState("0.00");
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Member");
    setUserRole(localStorage.getItem("role"));
    setUserCredits(localStorage.getItem("credits") || "0.00");
    fetchMyLicenses();
  }, []);

  const fetchMyLicenses = async () => {
    setLoading(true);
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

  const activeLicenses = licenses.filter(l => l.status === "active");
  const historyLicenses = licenses.filter(l => l.status !== "active");

  const handleDownloadProtocol = async (licenseId: string, productName: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/api/licenses/download/${licenseId}`), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        let errMsg = "Cannot locate executable protocol attached to this license.";
        try {
            const err = await res.json();
            errMsg = err.detail || errMsg;
        } catch {}
        alert("SECURITY INTERCEPT: " + errMsg);
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '_')}.exe`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch(e) {
      alert("Network transmission failure while compiling binary construct.");
    }
  };

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
                Product<span className="text-indigo-500 italic">Vault</span>
              </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
             <button onClick={() => window.location.href = "/store"} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Marketplace</button>
              <button onClick={() => window.location.href = "/inventory"} className="text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors border-b-2 border-indigo-500 pb-1 italic">Product Vault</button>
             <button onClick={() => alert("Network Status: STABLE")} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Network Status</button>
          </div>

          <div className="flex items-center gap-4">
             {(userRole === "admin" || userRole === "reseller") && (
               <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex flex-col items-center">
                  <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Available Credits</span>
                  <span className="text-[11px] font-black text-white italic">${userCredits}</span>
               </div>
             )}
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">
                    {userRole === "reseller" ? "Neural Reseller" : userRole === "admin" ? "Master Admin" : "Authenticated Identity"}
                </span>
                <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{username}</span>
             </div>
             <div className="h-10 w-[1px] bg-zinc-900 mx-2" />
             <Link href="/store" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:border-indigo-500/30 transition-all">Marketplace</Link>
             <button 
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"
             >
                <Users className="w-4 h-4" />
             </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="py-20 px-8 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none" />
         <div className="max-w-[1400px] mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">Encrypted Storage Active</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Product <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient">Vault</span>
            </h1>
         </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto px-8 mb-12">
         <div className="inline-flex p-1.5 bg-zinc-950 border border-zinc-900 rounded-2xl gap-2">
            <button 
              onClick={() => setActiveTab("ACTIVE")}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                activeTab === "ACTIVE" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-600 hover:text-white"
              )}
            >
              <Zap className="w-3 h-3" /> Active Products
            </button>
            <button 
              onClick={() => setActiveTab("HISTORY")}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                activeTab === "HISTORY" ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-white"
              )}
            >
              <History className="w-3 h-3" /> Purchase History
            </button>
         </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 pb-32">
         {loading ? (
            <div className="flex justify-center py-20">
                <RefreshCw className="w-10 h-10 text-zinc-900 animate-spin" />
            </div>
         ) : activeTab === "ACTIVE" ? (
            activeLicenses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {activeLicenses.map(lic => (
                       <div key={lic.id} className="group relative bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                               <KeyIcon className="w-32 h-32 text-indigo-500" />
                           </div>

                           <div className="flex justify-between items-start mb-8 relative z-10">
                               <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                   <Package className="w-6 h-6 text-indigo-500" />
                               </div>
                               <div className="text-right">
                                   <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-emerald-500">
                                       Authenticated
                                   </span>
                               </div>
                           </div>

                           <div className="space-y-4 mb-8 relative z-10">
                               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter line-clamp-1">
                                   {lic.product?.name || "Product"}
                               </h3>
                               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">Activation Key:</p>
                                 <div className="p-4 bg-black border border-zinc-900 rounded-2xl font-mono text-[11px] text-white break-all select-all flex items-center justify-between group/key transition-all hover:border-indigo-500/20 shadow-inner">
                                   <span>{lic.key_string || lic.key_hash.substring(0, 16) + "..."}</span>
                                   <ExternalLink className="w-3 h-3 opacity-30 group-hover/key:opacity-100 transition-opacity text-indigo-500" />
                               </div>
                               <div className="pt-2">
                                   <button 
                                      onClick={() => handleDownloadProtocol(lic.id, lic.product?.name || "Protocol")}
                                      className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black text-white hover:text-indigo-400 hover:border-indigo-500/30 uppercase tracking-[0.2em] transition-all group/dl shadow-xl"
                                   >
                                      <Zap className="w-3 h-3 group-hover/dl:text-indigo-500 transition-colors" />
                                      Download Product
                                   </button>
                               </div>
                           </div>

                           <div className="flex items-center justify-between pt-6 border-t border-zinc-900/50">
                               <div className="flex flex-col">
                                   <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Time Remaining</span>
                                   <div className="flex items-center gap-2 text-indigo-400">
                                       <Clock className="w-3 h-3" />
                                       <span className="text-[10px] font-black uppercase tracking-widest italic">
                                           {new Date(lic.expires_at).toLocaleDateString()} @ {new Date(lic.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                   <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic mb-8">No products found in your account</p>
                   <Link href="/store" className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                       Visit Marketplace <ChevronRight className="w-4 h-4" />
                   </Link>
               </div>
            )
         ) : (
            <div className="space-y-4">
                <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-900/50 border-b border-zinc-900">
                                <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest"> Purchase Date</th>
                                <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Product Name</th>
                                <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Record ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/50 font-bold">
                            {licenses.map(lic => (
                                <tr key={lic.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6 text-[10px] text-zinc-500 whitespace-nowrap">
                                        {new Date(lic.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-[11px] text-white uppercase italic tracking-tighter">
                                        {lic.product?.name || "Target Protocol"}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                            lic.status === "active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-zinc-900 border-zinc-800 text-zinc-600"
                                        )}>
                                            {lic.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                         <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                             <Info className="w-3 h-3 text-zinc-600" />
                                             <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Vault Record #{lic.id.substring(0, 8)}</span>
                                         </div>
                                    </td>
                                </tr>
                            ))}
                            {licenses.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-zinc-700 uppercase tracking-widest text-[10px] italic">
                                        No historical records detected in purchase log.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center gap-3 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem]">
                    <ShoppingBag className="w-5 h-5 text-indigo-500" />
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex-1">
                        Looking for more power? Visit the marketplace for the latest security products.
                    </p>
                    <Link href="/store" className="text-[9px] font-black text-white bg-indigo-600 px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-indigo-500 transition-all">Go to Store</Link>
                </div>
            </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 w-full h-12 bg-black border-t border-zinc-900/50 backdrop-blur-xl flex items-center px-10 justify-between z-50">
        <div className="flex items-center gap-6">
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Neural Vault System v4.2</span>
        </div>
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">© 2026 Percepta Intelligence Hub</span>
      </div>
    </div>
  );
}
