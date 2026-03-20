"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Terminal, 
  Search, 
  Filter, 
  Activity, 
  Shield, 
  Clock, 
  MapPin, 
  Cpu,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Package
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

interface Log {
  id: string;
  license_id?: string;
  ip?: string;
  hwid?: string;
  message: string;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(getApiUrl("/api/licenses/admin/logs"));
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.hwid?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">
              Activity Logs
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Real-time audit trail of all system operations
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="px-6 py-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Live Feed Active</span>
             </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="FILTER BY MESSAGE, IP, OR HWID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-5 pl-14 pr-4 text-[11px] font-bold tracking-[0.2em] text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-zinc-800 uppercase"
          />
        </div>

        {/* Logs Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {loading ? (
             <div className="py-24 text-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Buffering encrypted stream...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-zinc-900">
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Timestamp</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Event Message</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">IP Address</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">HWID Status</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredLogs.map((log) => {
                    const isError = log.message.toLowerCase().includes("failed") || log.message.toLowerCase().includes("banned");
                    const isSuccess = log.message.toLowerCase().includes("success");

                    return (
                      <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3 text-zinc-500">
                             <Clock className="w-3 h-3" />
                             <span className="text-[10px] font-bold tracking-tighter uppercase whitespace-nowrap">
                               {new Date(log.timestamp).toISOString().replace("T", " ").substring(0, 19)}
                             </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              {isError ? <XCircle className="w-4 h-4 text-red-500" /> : isSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Shield className="w-4 h-4 text-primary" />}
                              <span className={cn(
                                "text-xs font-black uppercase italic tracking-tight",
                                isError ? "text-red-500" : isSuccess ? "text-emerald-500" : "text-white"
                              )}>
                                {log.message}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest">{log.ip || "0.0.0.0"}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <Cpu className="w-3 h-3 text-zinc-700" />
                              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                {log.hwid ? "FINGERPRINTED" : "UNBOUND"}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[9px] font-black text-zinc-800 uppercase italic bg-zinc-900 px-3 py-1 rounded-lg">
                             CLOUD_API_NODE
                           </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                 <div className="py-32 text-center">
                    <Terminal className="w-12 h-12 text-zinc-900 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">No matching events recorded</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
