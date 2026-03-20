"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  ShieldAlert, 
  MessageSquare, 
  Save, 
  RefreshCcw,
  Zap,
  Lock,
  Ban,
  Clock,
  Info,
  ShieldCheck
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

interface Setting {
  key: string;
  value: string;
}

const DEFAULT_MESSAGES = [
  { key: "msg_hwid_mismatch", label: "HWID Mismatch Error", icon: Lock, default: "Hardware ID mismatch. Contact support." },
  { key: "msg_banned", label: "License Banned Message", icon: Ban, default: "This license has been banned." },
  { key: "msg_expired", label: "License Expired Message", icon: Clock, default: "Your license has expired." },
  { key: "msg_invalid", label: "Invalid Key Message", icon: ShieldAlert, default: "Invalid license key." }
];

export default function ApplicationPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [strictHwid, setStrictHwid] = useState(true);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(getApiUrl("/api/settings/"));
      if (res.ok) {
        const data: Setting[] = await res.json();
        const settingsMap: Record<string, string> = {};
        data.forEach(s => settingsMap[s.key] = s.value);
        setSettings(settingsMap);
      }
    } catch (err) {
      console.error("Fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(key);
    try {
      const res = await fetch(getApiUrl("/api/settings/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) setSettings(prev => ({ ...prev, [key]: value }));
    } catch (err) {
      console.error("Update failure:", err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1200px] mx-auto space-y-12">
        <div>
          <h1 className="text-[40px] font-black text-white uppercase italic leading-none mb-3">Application Settings</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">Global protocol overrides</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg"><Zap className="w-5 h-5 text-primary" /></div>
                  System Response Strings
                </h2>
                <div className="space-y-8">
                  {DEFAULT_MESSAGES.map((msg) => (
                    <div key={msg.key} className="bg-zinc-900/10 border border-zinc-900 rounded-3xl p-8 hover:border-zinc-800 transition-all">
                       <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-600 group-hover:text-primary"><msg.icon className="w-5 h-5" /></div>
                             <div><h3 className="text-xs font-black text-white uppercase tracking-widest">{msg.label}</h3></div>
                          </div>
                          <button disabled={saving === msg.key} className={cn("px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", saving === msg.key ? "bg-zinc-800 text-zinc-500" : "bg-primary text-white shadow-2xl")} onClick={() => { const i = document.getElementById(msg.key) as HTMLTextAreaElement; updateSetting(msg.key, i.value); }}>
                            {saving === msg.key ? "Syncing..." : "Update"}
                          </button>
                       </div>
                       <textarea id={msg.key} defaultValue={settings[msg.key] || msg.default} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-6 text-sm text-zinc-300 focus:border-primary/30 min-h-[80px] resize-none" />
                    </div>
                  ))}
                </div>
              </div>
           </div>

           <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-6 shadow-2xl">
              <h2 className="text-xl font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                  Heuristics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button onClick={() => setStrictHwid(!strictHwid)} className={cn("p-8 rounded-3xl border flex items-center justify-between", strictHwid ? "bg-primary/5 border-primary/20" : "bg-zinc-900/10 border-zinc-900")}>
                      <div className="text-left"><h4 className="text-[11px] font-black text-white uppercase mb-1">Strict HWID Locking</h4><p className="text-[10px] text-zinc-600 font-bold uppercase">Reject duplicates</p></div>
                      <div className={cn("w-12 h-6 rounded-full p-1", strictHwid ? "bg-primary" : "bg-zinc-800")}><div className={cn("w-4 h-4 bg-white rounded-full transition-all", strictHwid ? "translate-x-6" : "translate-x-0")} /></div>
                   </button>
                   <button onClick={() => setDevMode(!devMode)} className={cn("p-8 rounded-3xl border flex items-center justify-between", devMode ? "bg-primary/5 border-primary/20" : "bg-zinc-900/10 border-zinc-900")}>
                      <div className="text-left"><h4 className="text-[11px] font-black text-white uppercase mb-1">Developer Mode</h4><p className="text-[10px] text-zinc-600 font-bold uppercase">Verbose logging</p></div>
                      <div className={cn("w-12 h-6 rounded-full p-1", devMode ? "bg-primary" : "bg-zinc-800")}><div className={cn("w-4 h-4 bg-white rounded-full transition-all", devMode ? "translate-x-6" : "translate-x-0")} /></div>
                   </button>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
