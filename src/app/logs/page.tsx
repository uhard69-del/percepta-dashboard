"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Terminal, 
  Search, 
  Filter, 
  Pause, 
  Play, 
  RefreshCw,
  Clock,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

interface Log {
  id: string;
  message: string;
  status_type: string;
  ip: string | null;
  hwid: string | null;
  timestamp: string;
}

export default function RealtimePage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    if (isPaused) return;
    try {
      const res = await fetch(getApiUrl("/api/licenses/admin/logs"));
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error("Link failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const filtered = logs.filter(l => 
    l.message.toLowerCase().includes(search.toLowerCase()) ||
    (l.ip && l.ip.includes(search)) ||
    (l.id && l.id.includes(search))
  );

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-2 h-2 rounded-full", isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse")} />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                    {isPaused ? "Buffer Paused" : "Live Security Link Active"}
                </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Realtime Status</h1>
          </div>
          
          <div className="flex gap-4">
             <button 
                onClick={() => setIsPaused(!isPaused)}
                className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                    isPaused ? "bg-emerald-600 text-white" : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white"
                )}
             >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                {isPaused ? "Resume Feed" : "Pause Interface"}
             </button>
             <button onClick={fetchLogs} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-600 hover:text-white transition-all">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                    type="text"
                    placeholder="SEARCH BY KEY, IP OR STATUS..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-800 outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all uppercase"
                />
            </div>
            <button className="flex items-center gap-3 px-6 py-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:border-zinc-800 transition-all">
                <Filter className="w-4 h-4" />
                Filter by Product
            </button>
        </div>

        {/* Realtime Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
                <thead>
                    <tr className="border-b border-zinc-900/50 bg-zinc-900/10">
                        <th className="px-8 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">ID / Status</th>
                        <th className="px-8 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Date / Timestamp</th>
                        <th className="px-8 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Security Message</th>
                        <th className="px-8 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Relay Address</th>
                        <th className="px-8 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right whitespace-nowrap">Audit Link</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/30">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">Buffering Cloud Stream...</td>
                        </tr>
                    ) : filtered.length > 0 ? (
                        filtered.map((log) => {
                            const isFail = log.message.toLowerCase().includes("fail") || log.status_type !== "SUCCESS";
                            return (
                                <tr key={log.id} className="group hover:bg-zinc-900/10 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic group-hover:text-zinc-500 transition-colors">#{log.id.substring(0, 4)}</p>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shadow-sm",
                                                isFail ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5"
                                            )}>
                                                {log.status_type || "EVENT"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-zinc-800" />
                                            <span className="text-[10px] font-black text-zinc-500 uppercase italic">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            {isFail ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                            <p className={cn(
                                                "text-xs font-black uppercase italic tracking-tighter",
                                                isFail ? "text-red-500" : "text-white"
                                            )}>{log.message}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-mono text-[10px] font-bold text-zinc-600 tracking-widest">
                                        {log.ip || "RELAY_HIDDEN"}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-xl hover:bg-zinc-900 hover:border-zinc-800 transition-all text-zinc-800 hover:text-white">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">No events in current buffer</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
