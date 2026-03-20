"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Key, 
  Shield, 
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Search as SearchIcon,
  RefreshCcw,
  Zap,
  Lock,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

// Robust API helper
const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  if (normalizedBase.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${normalizedBase}${normalizedPath.substring(4)}`;
  }
  return `${normalizedBase}${normalizedPath}`;
};

interface License {
  id: string;
  key_hash: string;
  product?: { name: string };
  user?: { username: string };
  status: string;
  expires_at: string;
  hwid?: string;
  last_ip?: string;
  last_used_at?: string;
}

interface Product {
  id: string;
  name: string;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [expiryDays, setExpiryDays] = useState("30");
  const [generatedKey, setGeneratedKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [licRes, prodRes] = await Promise.all([
        fetch(getApiUrl("/api/licenses/admin/licenses")),
        fetch(getApiUrl("/api/products/admin/products"))
      ]);
      
      if (licRes.ok) setLicenses(await licRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (err) {
      console.error("Fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "reset-hwid" | "ban" | "delete", licenseId: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/licenses/admin/licenses/${licenseId}/${action}`), {
        method: "POST"
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(`Action failure: ${action}`, err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setIsGenerating(true);
    try {
      const expiresAt = new Date();
      if (isLifetime) expiresAt.setFullYear(2099);
      else expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));

      const res = await fetch(getApiUrl("/api/licenses/admin/licenses/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProductId,
          expires_at: expiresAt.toISOString()
        })
      });

      if (res.ok) {
        setGeneratedKey(await res.json());
        fetchData();
      }
    } catch (err) {
      console.error("Generation failure:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredLicenses = licenses.filter(lic => 
    lic.key_hash.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lic.hwid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">Generated Keys</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">Complete license lifecycle management</p>
          </div>
          <button onClick={() => { setGeneratedKey(""); setIsModalOpen(true); }} className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] group uppercase italic tracking-widest text-sm">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Generate New Keys
          </button>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-6 flex flex-col md:flex-row gap-6">
           <div className="relative flex-1 group">
             <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
             <input type="text" placeholder="SEARCH BY LICENSE KEY OR HWID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl py-4 pl-14 pr-4 text-[10px] font-bold tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-zinc-800" />
           </div>
           <div className="flex items-center gap-4">
              <div className="px-6 py-4 bg-zinc-900/50 rounded-2xl border border-zinc-900"><p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Active</p><p className="text-xl font-black text-white italic">{licenses.filter(l => l.status === "active").length}</p></div>
              <div className="px-6 py-4 bg-zinc-900/50 rounded-2xl border border-zinc-900"><p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Banned</p><p className="text-xl font-black text-red-500 italic">{licenses.filter(l => l.status === "banned").length}</p></div>
           </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
          {loading ? (
             <div className="py-24 text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" /><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Synchronizing secure data-streams...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900">
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">License Key</th>
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Project</th>
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Expiry</th>
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">HWID</th>
                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredLicenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-primary/[0.02] transition-colors group">
                      <td className="px-8 py-6"><span className="font-mono text-xs font-bold text-zinc-300 group-hover:text-primary transition-colors tracking-wider">{lic.key_hash.substring(0, 24)}...</span></td>
                      <td className="px-8 py-6"><span className="text-[10px] font-black text-white uppercase italic tracking-widest">{lic.product?.name || "ONE"}</span></td>
                      <td className="px-8 py-6"><span className="text-[10px] font-bold text-zinc-500 tracking-widest">{new Date(lic.expires_at).getFullYear() > 2090 ? "LIFETIME" : new Date(lic.expires_at).toISOString().replace("T", " ").substring(0, 19)}</span></td>
                      <td className="px-8 py-6"><span className={cn("text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg", lic.status === "active" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10")}>{lic.status}</span></td>
                      <td className="px-8 py-6"><span className={cn("text-[10px] font-mono font-bold tracking-tighter", lic.hwid ? "text-zinc-300" : "text-zinc-700")}>{lic.hwid ? "LOCKED" : "NOT SET"}</span></td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleAction("reset-hwid", lic.id)} className="px-3 py-2 bg-primary text-[9px] font-black uppercase italic rounded-lg text-white">Reset HWID</button>
                          <button onClick={() => handleAction("ban", lic.id)} className={cn("px-3 py-2 text-[9px] font-black uppercase italic rounded-lg text-white", lic.status === "banned" ? "bg-zinc-800" : "bg-indigo-600")}>Ban</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[2.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors"><Plus className="w-8 h-8 rotate-45" /></button>
            <div className="mb-10 text-center"><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Key Generation</h2><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Initialize new hardware-locked licenses</p></div>

            {generatedKey ? (
              <div className="space-y-6"><div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[2rem] text-center space-y-6"><div className="bg-black border border-zinc-900 rounded-2xl p-6 flex items-center justify-between"><code className="text-primary font-mono font-black text-2xl tracking-[0.2em]">{generatedKey}</code><button onClick={() => navigator.clipboard.writeText(generatedKey)} className="px-4 py-2 bg-zinc-900 text-[9px] font-black text-white uppercase rounded-xl">Copy</button></div></div><button onClick={() => setIsModalOpen(false)} className="w-full py-5 bg-zinc-900 text-zinc-400 font-bold rounded-2xl uppercase tracking-widest text-xs border border-zinc-800">Exit Encryption Chamber</button></div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="space-y-3"><label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Target Product</label>
                  <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-5 text-xs font-bold text-white uppercase tracking-widest" required><option value="">Select Application</option>{products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></div>

                <div className="space-y-4"><label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Duration Presets</label>
                  <div className="grid grid-cols-4 gap-3">{[{ l: "1D", v: "1" }, { l: "7D", v: "7" }, { l: "30D", v: "30" }, { l: "∞", v: "lifetime" }].map((p) => (<button key={p.l} type="button" onClick={() => { if (p.v === "lifetime") { setIsLifetime(true); setExpiryDays("0"); } else { setIsLifetime(false); setExpiryDays(p.v); } }} className={cn("py-3 rounded-xl border text-[10px] font-black transition-all uppercase italic tracking-widest", (p.v === "lifetime" ? isLifetime : (!isLifetime && expiryDays === p.v)) ? "bg-primary border-primary text-white" : "bg-zinc-900/50 border-zinc-900 text-zinc-600")}>{p.l}</button>))}</div></div>

                {!isLifetime && (<div className="space-y-3"><label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Custom Days</label><input type="number" value={expiryDays} onChange={(e) => setExpiryDays(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-5 text-xs text-white" min="1" required /></div>)}
                <button disabled={isGenerating || products.length === 0} className="w-full py-5 bg-primary text-white font-black rounded-2xl uppercase tracking-widest italic text-sm">Register License</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
