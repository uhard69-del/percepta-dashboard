"use client";

import { Header } from "@/components/Header";
import { 
  Settings, Zap, Shield, MessageSquare, RotateCcw, Save, CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const nb = base.endsWith("/") ? base.slice(0, -1) : base;
  const np = path.startsWith("/") ? path : `/${path}`;
  if (nb.endsWith("/api") && np.startsWith("/api/")) return `${nb}${np.substring(4)}`;
  return `${nb}${np}`;
};

interface Product { id: string; name: string; }

const defaultMessages = {
  hwid: "HWID mismatch",
  expired: "License expired",
  success: "License is OK!",
  notFound: "License key not found.",
  banned: "License is banned!",
  timeout: "Server timeout: Unable to authenticate within the time limit."
};

export default function ApplicationPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [hwidMsg, setHwidMsg] = useState(defaultMessages.hwid);
  const [expiredMsg, setExpiredMsg] = useState(defaultMessages.expired);
  const [successMsg, setSuccessMsg] = useState(defaultMessages.success);
  const [notFoundMsg, setNotFoundMsg] = useState(defaultMessages.notFound);
  const [bannedMsg, setBannedMsg] = useState(defaultMessages.banned);
  const [timeoutMsg, setTimeoutMsg] = useState(defaultMessages.timeout);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Protocol toggles
  const [strictHwid, setStrictHwid] = useState(true);
  const [kernelProtect, setKernelProtect] = useState(false);
  const [antiDebug, setAntiDebug] = useState(true);
  const [integrityCheck, setIntegrityCheck] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/api/products/admin/products"))
      .then(r => r.ok ? r.json() : [])
      .then(d => { setProducts(d); if (d.length > 0) setSelectedProduct(d[0].name); })
      .catch(() => {});
  }, []);

  const handleReset = () => {
    setHwidMsg(defaultMessages.hwid);
    setExpiredMsg(defaultMessages.expired);
    setSuccessMsg(defaultMessages.success);
    setNotFoundMsg(defaultMessages.notFound);
    setBannedMsg(defaultMessages.banned);
    setTimeoutMsg(defaultMessages.timeout);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const protocols = [
    { label: "Strict HWID Lock", desc: "Bind license to hardware ID", state: strictHwid, set: setStrictHwid, color: "primary" },
    { label: "Kernel Protection", desc: "Deep system-level shielding", state: kernelProtect, set: setKernelProtect, color: "red-500" },
    { label: "Anti-Debug Mode", desc: "Detect and block debuggers", state: antiDebug, set: setAntiDebug, color: "amber-500" },
    { label: "Integrity Check", desc: "Verify binary integrity on launch", state: integrityCheck, set: setIntegrityCheck, color: "emerald-500" },
  ];

  const messageFields = [
    { label: "HWID Message", value: hwidMsg, set: setHwidMsg },
    { label: "License Expired Message", value: expiredMsg, set: setExpiredMsg },
    { label: "License Success Message", value: successMsg, set: setSuccessMsg },
    { label: "License Not Found Message", value: notFoundMsg, set: setNotFoundMsg },
    { label: "License Banned Message", value: bannedMsg, set: setBannedMsg },
    { label: "Server Timeout Message", value: timeoutMsg, set: setTimeoutMsg },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1200px] mx-auto space-y-8 pb-20">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Application</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Application Settings</h1>
        </div>

        {/* Project Selector */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Select a Project</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none cursor-pointer">
              {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              {products.length === 0 && <option value="">No products</option>}
            </select>
            <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">Select the project you want to manage its settings for.</p>
          </div>
        </div>

        {/* Custom Response Messages */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-primary" />
            Custom Response Messages
          </h2>

          <div className="space-y-5">
            {messageFields.map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{field.label}</label>
                <input value={field.value} onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-primary/50 transition-all" />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={handleReset} className="flex-1 py-4 bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600/20 transition-all flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset Messages to Default
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : showSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : showSuccess ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Security Protocols */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <Shield className="w-4 h-4 text-primary" />
            Security Protocols
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protocols.map((p) => (
              <button key={p.label} onClick={() => p.set(!p.state)}
                className={cn("p-6 rounded-2xl border transition-all text-left",
                  p.state ? `bg-${p.color}/5 border-${p.color}/20` : "bg-zinc-900/20 border-zinc-900")}>
                <div className="flex items-center justify-between mb-3">
                  <Zap className={cn("w-5 h-5", p.state ? `text-${p.color}` : "text-zinc-600")} />
                  <div className={cn("w-10 h-5 rounded-full p-1 transition-all", p.state ? "bg-primary" : "bg-zinc-800")}>
                    <div className={cn("w-3 h-3 bg-white rounded-full transition-all", p.state ? "translate-x-5" : "translate-x-0")} />
                  </div>
                </div>
                <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{p.label}</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
