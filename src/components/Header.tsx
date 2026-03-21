"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Search, User, ChevronDown, Shield, LogOut, Settings, ExternalLink, Zap, ShieldAlert, Package } from "lucide-react";
import { cn } from "@/lib/utils";

import { getApiUrl } from "@/lib/api";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

export function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState("Admin");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setUserRole(role);
    setUsername(localStorage.getItem("username") || "Member");
    
    if (role === "admin" || role === "reseller") {
      const fetchNotifs = async () => {
        try {
          const res = await fetch(getApiUrl("/api/licenses/admin/logs"), {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
          });
          if (res.ok) {
            const data = await res.json();
            setNotifications(data.slice(0, 5));
          }
        } catch (err) {
          console.error("Notif fetch failure", err);
        }
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-20 border-b border-zinc-900/50 bg-[#08080A]/80 backdrop-blur-3xl px-10 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={isAdmin ? "SEARCH CRYPTOGRAPHIC LEDGER..." : "SEARCH PROTOCOLS..."}
            className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all uppercase"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isAdmin && (
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                 "p-3.5 rounded-2xl bg-zinc-900/50 border transition-all relative group",
                 showNotifications ? "border-indigo-500/50 bg-indigo-500/5" : "border-zinc-900 hover:border-zinc-800"
              )}
            >
              <Bell className={cn("w-5 h-5 transition-colors", showNotifications ? "text-indigo-500" : "text-zinc-500 group-hover:text-white")} />
              {notifications.length > 0 && (
                 <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-96 bg-[#0A0A0C] border border-zinc-900 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-6 overflow-hidden">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Security Alerts</h3>
                    <span className="text-[9px] font-black text-indigo-500 uppercase px-2 py-1 bg-indigo-500/10 rounded-lg">Real-Time</span>
                 </div>
                 <div className="space-y-4">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl hover:border-zinc-800 transition-all group">
                         <div className="flex gap-3">
                            <div className="mt-1 p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                               <ShieldAlert className="w-3 h-3 text-indigo-500" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{n.message}</p>
                               <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                       <div className="py-10 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No alerts in queue</div>
                    )}
                 </div>
                 <button className="w-full mt-6 py-4 bg-zinc-950 border border-zinc-900 rounded-xl text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white hover:border-zinc-800 transition-all">Clear All Traces</button>
              </div>
            )}
          </div>
        )}
        
        <div className="h-10 w-[1px] bg-zinc-900" />
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={cn(
              "flex items-center gap-4 pl-2 pr-5 py-2 rounded-2xl bg-zinc-900/50 border transition-all group",
              showProfile ? "border-indigo-500/50 bg-indigo-500/5" : "border-zinc-900 hover:border-zinc-800"
            )}
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
              <User className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-white uppercase italic tracking-tighter leading-none mb-1">{username}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                {userRole === "admin" ? "Master Dev" : userRole === "reseller" ? "Neural Reseller" : "Node Member"}
              </p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-zinc-700 transition-transform", showProfile ? "rotate-180" : "group-hover:text-zinc-500")} />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-80 bg-[#0A0A0C] border border-zinc-900 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-8">
               <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <Shield className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{username}</h3>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    {userRole === "admin" ? "Master Administrator" : userRole === "reseller" ? "Authorized Reseller" : "Standard Member"}
                  </p>
               </div>
               
                <div className="space-y-2">
                    {userRole === "admin" && (
                      <>
                        <button 
                          onClick={() => window.location.href = "/application"}
                          className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                        >
                           <Settings className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Config</span>
                        </button>
                        <button 
                          onClick={() => window.location.href = "/dashboard"}
                          className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                        >
                           <Zap className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Matrix Status</span>
                        </button>
                      </>
                    )}
                    {userRole === "reseller" && (
                      <>
                        <button 
                          onClick={() => window.location.href = "/dashboard"}
                          className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                        >
                           <Zap className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Command Center</span>
                        </button>
                        <button 
                          onClick={() => window.location.href = "/licenses"}
                          className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                        >
                           <Shield className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">My Licenses</span>
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => window.location.href = "/inventory"}
                      className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                    >
                       <Package className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Intelligence Vault</span>
                    </button>
                    <button 
                      onClick={() => window.location.href = "/store"}
                      className="w-full p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:border-indigo-500/30 transition-all group"
                    >
                       <Zap className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marketplace</span>
                    </button>
                  <div className="pt-4 border-t border-zinc-900">
                     <button 
                       onClick={() => {
                         localStorage.clear();
                         window.location.href = "/login";
                       }}
                       className="w-full p-4 bg-zinc-900/50 border border-zinc-900 rounded-2xl flex items-center gap-4 hover:bg-red-500/5 hover:border-red-500/30 transition-all group"
                     >
                        <LogOut className="w-4 h-4 text-zinc-600 group-hover:text-red-500" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-red-500">Terminate Session</span>
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
