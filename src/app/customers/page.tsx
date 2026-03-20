"use client";

import { Header } from "@/components/Header";
import { 
  Users, Search, Plus, ExternalLink, MoreHorizontal, X
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

interface Customer {
  id: string;
  username?: string;
  email?: string;
  discord_id?: string;
  login_email?: string;
  created_at?: string;
  license_count?: number;
  log_count?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("ID");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDiscord, setNewDiscord] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(getApiUrl("/api/users/admin/users"));
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.map((u: Record<string, unknown>) => ({
          id: u.id || u.user_id || "",
          username: u.username || u.name || "",
          email: u.email || "",
          discord_id: u.discord_id || "",
          login_email: u.login_email || u.email || "",
          created_at: u.created_at || "",
          license_count: u.license_count || 0,
          log_count: u.log_count || 0,
        })));
      }
    } catch (err) { console.error("Failed to fetch customers:", err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl("/api/users/admin/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newName, email: newEmail, discord_id: newDiscord })
      });
      if (res.ok) { fetchCustomers(); setShowCreateModal(false); setNewName(""); setNewEmail(""); setNewDiscord(""); }
    } catch (err) { console.error("Create failed:", err); }
  };

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (filterBy === "ID") return c.id?.toLowerCase().includes(q);
    if (filterBy === "Name") return c.username?.toLowerCase().includes(q);
    if (filterBy === "Email") return (c.email || c.login_email)?.toLowerCase().includes(q);
    return true;
  });

  const formatDate = (d: string) => {
    if (!d) return "–";
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">CRM</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Customers</h1>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase tracking-widest text-[9px]">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>

        {/* Controls */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Filter by</span>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option>ID</option>
              <option>Name</option>
              <option>Email</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Search</span>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search by ${filterBy.toLowerCase()}`}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-[10px] font-bold text-white outline-none placeholder:text-zinc-700" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-24 text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900">
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Discord ID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Login Email</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Created At</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Licenses</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Logs</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors">
                      <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-500">{c.id?.substring(0, 12)}...</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-white">{c.username || "–"}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-primary">{c.discord_id || "–"}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-400">{c.login_email || "–"}</span></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold text-zinc-500">{formatDate(c.created_at || "")}</span></td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 cursor-pointer hover:text-blue-300">
                          {c.license_count || 0} Licenses <ExternalLink className="w-3 h-3" />
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 cursor-pointer hover:text-blue-300">
                          {c.log_count || 0} Logs <ExternalLink className="w-3 h-3" />
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCustomers.length === 0 && (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No customers found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-md rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6">Create Customer</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Name</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Discord ID</label>
                <input value={newDiscord} onChange={(e) => setNewDiscord(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none font-mono" />
              </div>
              <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all">Create Customer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
