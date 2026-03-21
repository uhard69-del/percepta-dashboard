"use client";

import { Header } from "@/components/Header";
import { 
  Users, Search, Plus, ExternalLink, MoreHorizontal, X, 
  ShieldAlert, Ban, UserCheck, Key, Edit, Trash2, Zap, AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface Customer {
  id: string;
  username: string;
  email: string;
  discord_id: string;
  role: string;
  credits: string;
  is_banned: boolean;
  created_at: string;
  total_licenses: number;
  total_logs: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("Name");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  
  // Create Form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDiscord, setNewDiscord] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(getApiUrl("/api/users/admin/users"), {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) { console.error("Failed to fetch customers:", err); }
    finally { setLoading(false); }
  };

  const handleBan = async (userId: string) => {
    if (!confirm("Are you sure you want to toggle ban status for this user?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/admin/users/${userId}/ban`), {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) fetchCustomers();
    } catch (err) { alert("Ban failed"); }
  };

  const handleResetPassword = async (userId: string) => {
    const newPass = prompt("Enter new temporary password:");
    if (!newPass) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/admin/users/${userId}`), {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) alert("Password reset successful.");
    } catch (err) { alert("Reset failed"); }
  };

  const handleSystemPurge = async () => {
    if (!confirm("CRITICAL WARNING: This will PERMANENTLY delete all Logs, Licenses, Products, and non-admin Users. Proceed?")) return;
    try {
      const res = await fetch(getApiUrl("/api/settings/purge"), {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("System Purged successfully.");
        fetchCustomers();
      }
    } catch (err) { alert("Purge failed"); }
  };

  const handleInitialize = async () => {
    try {
      const res = await fetch(getApiUrl("/api/settings/initialize-percepta"), {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Percepta AI Protocols initialized.");
        fetchCustomers();
      }
    } catch (err) { alert("Init failed"); }
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (filterBy === "ID") return c.id?.toLowerCase().includes(q);
    if (filterBy === "Name") return c.username?.toLowerCase().includes(q);
    if (filterBy === "Email") return c.email?.toLowerCase().includes(q);
    return true;
  });

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Neural Hub CRM</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none underline decoration-primary/20 decoration-4">Customers</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSystemModal(true)} 
              className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-widest text-[9px]"
            >
              <ShieldAlert className="w-4 h-4" /> System Console
            </button>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase tracking-widest text-[9px]">
              <Plus className="w-4 h-4" /> Create operative
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-6 flex flex-wrap gap-6 items-center shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest opacity-50">Filter Mode</span>
            <div className="flex p-1 bg-zinc-900 rounded-xl gap-1">
                {["Name", "Email", "ID"].map(f => (
                    <button key={f} onClick={() => setFilterBy(f)} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", filterBy === f ? "bg-primary text-white" : "text-zinc-600 hover:text-zinc-400")}>{f}</button>
                ))}
            </div>
          </div>
          <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
              <input 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder={`Query neural database by ${filterBy.toLowerCase()}...`}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-bold text-white outline-none placeholder:text-zinc-700 focus:border-primary/50 transition-all" 
              />
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-24 text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/40 border-b border-zinc-900">
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Operative</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Access State</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Protocols</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Audit Logs</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-right">Moderations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className={cn("hover:bg-primary/[0.02] transition-colors group", c.is_banned && "bg-red-500/[0.02]")}>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">{c.username}</span>
                            <span className="text-[9px] font-bold text-zinc-600 font-mono tracking-tight">{c.email || "NO_COMM_CHANNEL"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                            "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                            c.is_banned 
                                ? "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                        )}>
                            {c.is_banned ? "Severed" : "Linked"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-zinc-500 font-bold text-[10px]">{c.total_licenses} Active</td>
                      <td className="px-8 py-6 text-zinc-500 font-bold text-[10px]">{c.total_logs} Events</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleResetPassword(c.id)} title="Reset Neural Key" className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-primary transition-all shadow-inner"><Key className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleBan(c.id)} title={c.is_banned ? "Restore Access" : "Sever Access"} className={cn("p-3 bg-zinc-900 border border-zinc-800 rounded-xl transition-all shadow-inner", c.is_banned ? "text-emerald-500" : "hover:text-red-500")}>
                                {c.is_banned ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            </button>
                            <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white transition-all shadow-inner"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr><td colSpan={6} className="py-20 text-center text-zinc-700 uppercase tracking-widest text-[10px] italic">No operatives detected in neural sector</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* System Console Modal */}
      {showSystemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
              <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none align-baseline"><ShieldAlert className="w-48 h-48 text-primary" /></div>
                  <button onClick={() => setShowSystemModal(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">System Console</h2>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-10">Administrative Override & Initialization</p>
                  
                  <div className="space-y-6">
                      <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl group flex items-start gap-4">
                          <Trash2 className="w-8 h-8 text-red-500 mt-1" />
                          <div className="flex-1">
                              <h3 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-1">Production Purge</h3>
                              <p className="text-[10px] text-zinc-600 font-bold mb-4 uppercase tracking-tighter leading-relaxed">Permanently sever all test links. This wipes Logs, Licenses, Products, and Customers. Restore clean factory state.</p>
                              <button onClick={handleSystemPurge} className="px-6 py-3 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all">Execute Purge</button>
                          </div>
                      </div>

                      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl group flex items-start gap-4">
                          <Zap className="w-8 h-8 text-indigo-500 mt-1" />
                          <div className="flex-1">
                              <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-1">Percepta AI Launch</h3>
                              <p className="text-[10px] text-zinc-600 font-bold mb-4 uppercase tracking-tighter leading-relaxed">Initialize official Aimbot protocols (Pro/Lite) into the neural matrix for active distribution.</p>
                              <button onClick={handleInitialize} className="px-6 py-3 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all">Initialize Launch</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Create operative Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-md rounded-[2.5rem] p-12 shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Deploy Operative</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch(getApiUrl("/api/users/admin/users"), {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
                  body: JSON.stringify({ username: newName, email: newEmail, discord_id: newDiscord, password: "temp_password_123" })
                });
                if (res.ok) { fetchCustomers(); setShowCreateModal(false); }
              } catch (e) {}
            }} className="space-y-6 italic">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Codename</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} required placeholder="operative_01"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Neural Address</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="contact@nexus.io"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-xs font-bold text-white outline-none focus:border-primary/50" />
              </div>
              <button className="w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Establish Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
