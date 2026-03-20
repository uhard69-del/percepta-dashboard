"use client";

import { Header } from "@/components/Header";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Database, 
  Globe,
  Bell,
  Cpu,
  CheckCircle2,
  Save
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [username, setUsername] = useState("admin");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isPublicApiEnabled, setIsPublicApiEnabled] = useState(false);
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      
      <div className="p-10 max-w-[1200px] mx-auto space-y-12 pb-20">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">
              System Settings
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Control center for your SaaS infrastructure
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] group uppercase italic tracking-widest text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Syncing..." : showSuccess ? "Securely Saved" : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Section 1: Admin Profile */}
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                 <User className="w-4 h-4 text-primary" />
                 Administrator Profile
              </h2>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-900/30 border border-zinc-900 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Security Key (Password)</label>
                    <input 
                      type="password" 
                      defaultValue="********" 
                      className="w-full bg-zinc-900/30 border border-zinc-900 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" 
                    />
                 </div>
                 <button className="w-full py-4 bg-zinc-900/50 text-zinc-400 text-[10px] font-black uppercase italic tracking-widest rounded-xl border border-zinc-800 hover:bg-zinc-900 hover:text-white transition-all">
                    Update Credentials
                 </button>
              </div>
           </div>

           {/* Section 2: Infrastructure Status */}
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                 <Cpu className="w-4 h-4 text-emerald-500" />
                 Cloud Node Status
              </h2>
              
              <div className="space-y-4">
                 {[
                   { label: "Backend API (Render)", status: "Active", node: "iad1-02" },
                   { label: "PostgreSQL (Neon)", status: "Connected", node: "us-east-1" },
                   { label: "Dashboard (Vercel)", status: "Optimized", node: "Edge" }
                 ].map((node) => (
                   <div key={node.label} className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl">
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{node.label}</p>
                         <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">{node.node}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-500 uppercase italic bg-emerald-500/10 px-3 py-1 rounded-lg">
                         {node.status}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Section 3: System Preferences */}
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl md:col-span-2">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
                 <Shield className="w-4 h-4 text-primary" />
                 Global Security Protocol
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Notification Toggle */}
                 <button 
                   onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                   className={cn(
                     "p-6 rounded-3xl border transition-all text-left group",
                     isNotificationsEnabled ? "bg-primary/5 border-primary/20" : "bg-zinc-900/20 border-zinc-900"
                   )}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <Bell className={cn("w-5 h-5", isNotificationsEnabled ? "text-primary" : "text-zinc-600")} />
                       <div className={cn(
                         "w-10 h-5 rounded-full p-1 transition-all",
                         isNotificationsEnabled ? "bg-primary" : "bg-zinc-800"
                       )}>
                         <div className={cn(
                           "w-3 h-3 bg-white rounded-full transition-all",
                           isNotificationsEnabled ? "translate-x-5" : "translate-x-0"
                         )} />
                       </div>
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Login Notifications</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Alert on admin access</p>
                 </button>

                 {/* API Access Toggle */}
                 <button 
                   onClick={() => setIsPublicApiEnabled(!isPublicApiEnabled)}
                   className={cn(
                     "p-6 rounded-3xl border transition-all text-left group",
                     isPublicApiEnabled ? "bg-primary/5 border-primary/20" : "bg-zinc-900/20 border-zinc-900"
                   )}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <Globe className={cn("w-5 h-5", isPublicApiEnabled ? "text-primary" : "text-zinc-600")} />
                       <div className={cn(
                         "w-10 h-5 rounded-full p-1 transition-all",
                         isPublicApiEnabled ? "bg-primary" : "bg-zinc-800"
                       )}>
                         <div className={cn(
                           "w-3 h-3 bg-white rounded-full transition-all",
                           isPublicApiEnabled ? "translate-x-5" : "translate-x-0"
                         )} />
                       </div>
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Public API Access</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Allow external requests</p>
                 </button>

                 {/* Auto-Backup Toggle */}
                 <button 
                   onClick={() => setIsAutoBackupEnabled(!isAutoBackupEnabled)}
                   className={cn(
                     "p-6 rounded-3xl border transition-all text-left group",
                     isAutoBackupEnabled ? "bg-primary/5 border-primary/20" : "bg-zinc-900/20 border-zinc-900"
                   )}
                 >
                    <div className="flex items-center justify-between mb-4">
                       <Database className={cn("w-5 h-5", isAutoBackupEnabled ? "text-primary" : "text-zinc-600")} />
                       <div className={cn(
                         "w-10 h-5 rounded-full p-1 transition-all",
                         isAutoBackupEnabled ? "bg-primary" : "bg-zinc-800"
                       )}>
                         <div className={cn(
                           "w-3 h-3 bg-white rounded-full transition-all",
                           isAutoBackupEnabled ? "translate-x-5" : "translate-x-0"
                         )} />
                       </div>
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Auto-Backup</p>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Secure data redundancy</p>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
