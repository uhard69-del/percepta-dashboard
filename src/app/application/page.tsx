"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { 
  ShieldCheck, 
  Zap, 
  Webhook, 
  Lock, 
  CloudRain, 
  Wifi, 
  Terminal,
  Save,
  RefreshCw,
  AlertCircle,
  ToggleLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProtocolToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: any;
  danger?: boolean;
}

export default function ApplicationPage() {
  const [toggles, setToggles] = useState<ProtocolToggle[]>([
    { 
        id: "auto_release", 
        name: "Auto key release on payment", 
        description: "Automatically issue license keys via Stage-3 relay upon successful transaction verification.", 
        enabled: true, 
        icon: Zap 
    },
    { 
        id: "webhook_delivery", 
        name: "Webhook delivery enabled", 
        description: "Enable real-time event dispatching to configured Discord or custom HTTP endpoints.", 
        enabled: true, 
        icon: Webhook 
    },
    { 
        id: "stage1_sec", 
        name: "Stage-1 security protocol", 
        description: "Enforce biometric and cryptographic hardware validation on initial client handshake.", 
        enabled: true, 
        icon: ShieldCheck 
    },
    { 
        id: "anti_leak", 
        name: "Anti-leak protection", 
        description: "Detect and neutralize unauthorized binary redistribution attempts in memory.", 
        enabled: false, 
        icon: Lock,
        danger: true
    },
    { 
        id: "cloud_relay", 
        name: "Cloud-relay failover", 
        description: "Automatically route traffic through standby nodes if the master US-EAST node is compromised.", 
        enabled: true, 
        icon: CloudRain 
    },
    {
        id: "hw_id_lock",
        name: "Strict HWID Lock",
        description: "Enforce 1-to-1 hardware mapping. Prevents account sharing and unauthorized multi-box usage.",
        enabled: true,
        icon: Lock
    },
    {
        id: "kernel_sec",
        name: "Kernel-level Protection",
        description: "Deploy ring-0 memory obfuscation to neutralize advanced dumping tools.",
        enabled: false,
        icon: ShieldCheck,
        danger: true
    },
    { 
        id: "dev_mode", 
        name: "Developer Override Mode", 
        description: "Bypass certain security checks for local testing. SHOULD BE DISABLED IN PRODUCTION.", 
        enabled: false, 
        icon: Terminal,
        danger: true
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleProtocol = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    setSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1200px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">System Configuration</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Application Protocols</h1>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl disabled:opacity-50",
                success ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
            )}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : success ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Syncing..." : success ? "Protocols Updated" : "Commit Changes"}
          </button>
        </div>

        <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Wifi className="w-64 h-64 text-indigo-500 -mr-20 -mt-20" />
            </div>

            <div className="space-y-6 relative z-10">
                {toggles.map((t) => (
                    <div 
                        key={t.id} 
                        onClick={() => toggleProtocol(t.id)}
                        className={cn(
                            "group p-6 bg-zinc-900/20 border rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-500",
                            t.enabled ? "border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : "border-zinc-900 hover:border-zinc-800"
                        )}
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500",
                                t.enabled ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500" : "bg-zinc-950 border-zinc-900 text-zinc-700 group-hover:text-zinc-500"
                            )}>
                                <t.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={cn(
                                    "text-sm font-black uppercase tracking-widest italic mb-1 transition-all",
                                    t.enabled ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                                )}>
                                    {t.name}
                                </h3>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-[500px] leading-relaxed opacity-60">
                                    {t.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {t.danger && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">High Risk</span>
                                </div>
                            )}
                            <div className={cn(
                                "w-14 h-8 rounded-full border p-1 transition-all duration-500 relative",
                                t.enabled ? "bg-indigo-600 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-zinc-950 border-zinc-900"
                            )}>
                                <div className={cn(
                                    "w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-500 transform",
                                    t.enabled ? "translate-x-6" : "translate-x-0"
                                )} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Protocol Alert Section */}
        <div className="p-8 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-[2.5rem] flex items-center gap-8">
            <div className="w-20 h-20 bg-indigo-500/5 border border-indigo-500/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-indigo-500/40" />
            </div>
            <div className="flex-1">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">Protocol Integrity Check</h4>
                <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-widest leading-relaxed">
                    Changes to application protocols affect all active Stage-3 sessions. Ensure your client SDK version is synchronized with these settings.
                </p>
            </div>
            <button className="px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-xl text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-all">
                Audit Logs
            </button>
        </div>
      </div>
    </div>
  );
}
