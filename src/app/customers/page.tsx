"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  MoreVertical, 
  ExternalLink,
  Mail,
  MessageSquare,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

interface Customer {
  id: string;
  username: string;
  email: string | null;
  discord_id: string | null;
  avatar_url: string | null;
  role: string;
  credits: string;
  created_at: string;
  total_licenses: number;
  total_logs: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/users/admin/users"));
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("CRM fetch failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = customers.filter(c => 
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Relationship Management</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Customer Hub</h1>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={fetchData}
                className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-white hover:border-zinc-800 transition-all"
             >
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button className="px-8 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Create Account
             </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                    type="text"
                    placeholder="SEARCH BY ID, MAIL OR USER..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all uppercase"
                />
            </div>
            <button className="flex items-center gap-3 px-6 py-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl group transition-all hover:border-zinc-800">
                <Filter className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500" />
                <span className="text-[10px] font-black text-zinc-500 group-hover:text-white uppercase tracking-widest italic">Filter By Node</span>
            </button>
        </div>

        {/* Customers Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-900/50">
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Customer Details</th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Engagement</th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Security Link</th>
                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/30">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Decrypting Customer Buffer...</td>
                        </tr>
                    ) : filtered.length > 0 ? (
                        filtered.map((c) => (
                            <tr key={c.id} className="group hover:bg-zinc-900/10 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                                                {c.avatar_url ? (
                                                    <img src={c.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-zinc-700 font-black text-xl italic">{c.username[0].toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#09090b] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-black text-white uppercase italic tracking-tighter">{c.username}</p>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                                    c.role === "admin" ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                                                    c.role === "reseller" ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                                                    "bg-zinc-900 text-zinc-600 border-zinc-800"
                                                )}>{c.role}</span>
                                            </div>
                                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none truncate max-w-[200px]">{c.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Licenses</p>
                                            <div className="flex items-center justify-center gap-1.5 group/btn cursor-pointer">
                                                <span className="text-sm font-black text-white italic group-hover/btn:text-indigo-400 transition-colors">{c.total_licenses}</span>
                                                <ExternalLink className="w-2.5 h-2.5 text-zinc-800 group-hover/btn:text-indigo-600" />
                                            </div>
                                        </div>
                                        <div className="w-[1px] h-8 bg-zinc-900" />
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Security Logs</p>
                                            <div className="flex items-center justify-center gap-1.5 group/btn cursor-pointer">
                                                <span className="text-sm font-black text-white italic group-hover/btn:text-indigo-400 transition-colors">{c.total_logs}</span>
                                                <TrendingUp className="w-2.5 h-2.5 text-zinc-800 group-hover/btn:text-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic group-hover:text-indigo-500/60 transition-colors">
                                            <MessageSquare className="w-3 h-3 text-indigo-500" />
                                            {c.discord_id || "UNLINKED_NODE"}
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-widest truncate max-w-[180px]">
                                            <Mail className="w-3 h-3 text-zinc-800" />
                                            {c.email || "NO_RELAY_CONFIGURED"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-xl hover:bg-zinc-900 hover:border-zinc-800 transition-all text-zinc-600 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">No matching entities in database</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
