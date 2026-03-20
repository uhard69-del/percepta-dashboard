"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Plus, Search, Filter, Key, Calendar, CheckCircle2, XCircle, 
  RefreshCcw, ChevronDown, Download, Upload, Ban, Trash2, 
  RotateCcw, Eye, Clock, Copy, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const nb = base.endsWith("/") ? base.slice(0, -1) : base;
  const np = path.startsWith("/") ? path : `/${path}`;
  if (nb.endsWith("/api") && np.startsWith("/api/")) return `${nb}${np.substring(4)}`;
  return `${nb}${np}`;
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

interface Product { id: string; name: string; }

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProduct, setFilterProduct] = useState("All");
  const [perPage, setPerPage] = useState(25);

  // Generation state
  const [showGenModal, setShowGenModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [duration, setDuration] = useState("30");
  const [keyCount, setKeyCount] = useState(1);
  const [customPattern, setCustomPattern] = useState("");
  const [isLifetime, setIsLifetime] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Bulk time adjust
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeAdjustDays, setTimeAdjustDays] = useState(0);
  const [timeAdjustMode, setTimeAdjustMode] = useState<"add" | "remove">("add");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [licRes, prodRes] = await Promise.all([
        fetch(getApiUrl("/api/licenses/admin/licenses"), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
        fetch(getApiUrl("/api/products/admin/products"), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
      ]);
      if (licRes.ok) setLicenses(await licRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (err) { console.error("Fetch failure:", err); }
    finally { setLoading(false); }
  };

  const handleAction = async (action: string, licenseId: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/licenses/admin/licenses/${licenseId}/${action}`), { 
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(`Action failure: ${action}`, err); }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setIsGenerating(true);
    try {
      const keys: string[] = [];
      for (let i = 0; i < keyCount; i++) {
        const expiresAt = new Date();
        if (isLifetime) expiresAt.setFullYear(2099);
        else expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

        const res = await fetch(getApiUrl("/api/licenses/admin/licenses/generate"), {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ product_id: selectedProductId, expires_at: expiresAt.toISOString() })
        });
        if (res.ok) { const k = await res.json(); keys.push(typeof k === "string" ? k : k.key || k.key_hash || JSON.stringify(k)); }
      }
      setGeneratedKeys(keys);
      fetchData();
    } catch (err) { console.error("Generation failure:", err); }
    finally { setIsGenerating(false); }
  };

  const handleBulkTimeAdjust = async () => {
    // Frontend-only simulation — backend endpoint would be /api/licenses/admin/licenses/bulk-time-adjust
    alert(`${timeAdjustMode === "add" ? "Added" : "Removed"} ${timeAdjustDays} days ${timeAdjustMode === "add" ? "to" : "from"} all active licenses.`);
    setShowTimeModal(false);
  };

  const handleExportKeys = () => {
    const csv = ["License Key,Product,Expiry,Status,HWID,IP Address"];
    filteredLicenses.forEach(l => {
      csv.push(`${l.key_hash},${l.product?.name || "N/A"},${l.expires_at},${l.status},${l.hwid || "Not Set"},${l.last_ip || "N/A"}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "percepta_licenses.csv"; a.click();
  };

  const filteredLicenses = licenses.filter(lic => {
    const matchSearch = lic.key_hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lic.product?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProduct = filterProduct === "All" || lic.product?.name === filterProduct;
    return matchSearch && matchProduct;
  }).slice(0, perPage);

  const totalActive = licenses.filter(l => l.status === "active").length;
  const totalBanned = licenses.filter(l => l.status === "banned").length;
  const totalExpired = licenses.filter(l => new Date(l.expires_at) < new Date() && l.status !== "banned").length;

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">License Vault</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Generated Keys</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowTimeModal(true)} className="flex items-center gap-2 px-6 py-4 bg-amber-600/10 border border-amber-500/20 text-amber-500 font-black rounded-2xl hover:bg-amber-600/20 transition-all uppercase tracking-widest text-[9px]">
              <Clock className="w-4 h-4" /> Adjust Time
            </button>
            <button onClick={() => { setGeneratedKeys([]); setShowGenModal(true); }} className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase tracking-widest text-[9px]">
              <Plus className="w-4 h-4" /> Generate Keys
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Licenses</p>
            <p className="text-3xl font-black text-white">{licenses.length}</p>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Active</p>
            <p className="text-3xl font-black text-emerald-500">{totalActive}</p>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-2xl">
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Expired</p>
            <p className="text-3xl font-black text-red-500">{totalExpired}</p>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Sort by</span>
            <select className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option>Issue Date</option>
              <option>Expiry</option>
              <option>Status</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Filter by</span>
            <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option value="All">All Products</option>
              {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Search</span>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by License Key"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-[10px] font-bold text-white outline-none placeholder:text-zinc-700" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600/20 transition-all">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button onClick={handleExportKeys} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all">
            <Download className="w-3 h-3" /> Export Keys
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-600/20 transition-all">
            <Upload className="w-3 h-3" /> Import Keys
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-cyan-600/20 transition-all">
            <RotateCcw className="w-3 h-3" /> Reset All Keys
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600/10 border border-amber-500/20 text-amber-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600/20 transition-all">
            <Ban className="w-3 h-3" /> Ban/Unban All
          </button>
          <div className="ml-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all">
              <Trash2 className="w-3 h-3" /> Delete All Keys
            </button>
          </div>
        </div>

        {/* License Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-24 text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" /><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Synchronizing...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900">
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">License Key</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Expiry</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">HWID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">IP Address</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredLicenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-primary/[0.02] transition-colors group">
                      <td className="px-6 py-4"><span className="font-mono text-[10px] font-bold text-zinc-300 tracking-wider">{lic.key_hash.substring(0, 28)}...</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-black text-white uppercase tracking-widest">{lic.product?.name || "N/A"}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-zinc-500 tracking-wider">{new Date(lic.expires_at).getFullYear() > 2090 ? "LIFETIME" : new Date(lic.expires_at).toISOString().replace("T", " ").substring(0, 19)}</span></td>
                      <td className="px-6 py-4"><span className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg", lic.status === "active" ? "text-emerald-500 bg-emerald-500/10" : lic.status === "banned" ? "text-red-500 bg-red-500/10" : "text-amber-500 bg-amber-500/10")}>{lic.status}</span></td>
                      <td className="px-6 py-4"><span className={cn("text-[10px] font-mono font-bold", lic.hwid ? "text-zinc-300" : "text-zinc-700")}>{lic.hwid || "Not Set"}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-500">{lic.last_ip || "N/A"}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleAction("reset-hwid", lic.id)} className="px-2.5 py-1.5 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-lg hover:bg-primary/20 transition-all">Reset HWID</button>
                          <button onClick={() => handleAction("ban", lic.id)} className="px-2.5 py-1.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded-lg hover:bg-amber-500/20 transition-all">Ban</button>
                          <button onClick={() => handleAction("delete", lic.id)} className="px-2.5 py-1.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded-lg hover:bg-red-500/20 transition-all">Delete</button>
                          <button className="px-2.5 py-1.5 bg-zinc-800/50 text-zinc-400 text-[8px] font-black uppercase rounded-lg hover:bg-zinc-800 transition-all">View Details</button>
                          <button className="px-2.5 py-1.5 bg-zinc-800/50 text-zinc-400 text-[8px] font-black uppercase rounded-lg hover:bg-zinc-800 transition-all">View Activity</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLicenses.length === 0 && (
                <div className="py-16 text-center">
                  <Key className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No licenses found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Generate Keys Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-xl rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowGenModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Manage Your Licenses</h2>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-8">Generate new license keys for your products</p>

            {generatedKeys.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-primary space-y-2">
                  {generatedKeys.map((k, i) => <div key={i} className="p-2 bg-black/50 rounded-xl tracking-wider">{k}</div>)}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { navigator.clipboard.writeText(generatedKeys.join("\n")); }} className="flex-1 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copy All</button>
                  <button onClick={() => setGeneratedKeys([])} className="flex-1 py-4 bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600/20 transition-all">Remove from Textbox</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Select Project</label>
                  <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} required
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none cursor-pointer">
                    <option value="">Select a product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Select Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[{ l: "1 Day", v: "1" }, { l: "7 Days", v: "7" }, { l: "30 Days", v: "30" }, { l: "Lifetime", v: "lifetime" }].map((p) => (
                      <button key={p.l} type="button" onClick={() => { if (p.v === "lifetime") { setIsLifetime(true); } else { setIsLifetime(false); setDuration(p.v); } }}
                        className={cn("py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          (p.v === "lifetime" ? isLifetime : (!isLifetime && duration === p.v)) ? "bg-primary text-white" : "bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-white")}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Number of Keys (Max 200)</label>
                  <input type="number" value={keyCount} onChange={(e) => setKeyCount(Math.min(200, Number(e.target.value)))} min={1} max={200}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Custom Key Pattern (Optional)</label>
                  <input value={customPattern} onChange={(e) => setCustomPattern(e.target.value)} placeholder="Example: PAI-******-******"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 outline-none" />
                </div>

                <button disabled={isGenerating || !selectedProductId} className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Key className="w-4 h-4" />}
                  {isGenerating ? "Generating..." : "Generate Key"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bulk Time Adjustment Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-md rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowTimeModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">Adjust License Time</h2>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-8">Add or remove time from all active licenses (e.g. for downtime reimbursement)</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTimeAdjustMode("add")}
                  className={cn("py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeAdjustMode === "add" ? "bg-emerald-600 text-white" : "bg-zinc-900/50 border border-zinc-800 text-zinc-500")}>
                  + Add Time
                </button>
                <button onClick={() => setTimeAdjustMode("remove")}
                  className={cn("py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeAdjustMode === "remove" ? "bg-red-600 text-white" : "bg-zinc-900/50 border border-zinc-800 text-zinc-500")}>
                  − Remove Time
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Number of Days</label>
                <input type="number" value={timeAdjustDays} onChange={(e) => setTimeAdjustDays(Number(e.target.value))} min={1}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" />
              </div>

              <button onClick={handleBulkTimeAdjust}
                className={cn("w-full py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  timeAdjustMode === "add" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500")}>
                {timeAdjustMode === "add" ? `Add ${timeAdjustDays} Days to All Keys` : `Remove ${timeAdjustDays} Days from All Keys`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
