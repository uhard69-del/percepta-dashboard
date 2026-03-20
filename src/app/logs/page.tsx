"use client";

import { Header } from "@/components/Header";
import { 
  Activity, Search, Pause, Play, ChevronDown, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "https://percepta-backend.onrender.com";
  const nb = base.endsWith("/") ? base.slice(0, -1) : base;
  const np = path.startsWith("/") ? path : `/${path}`;
  if (nb.endsWith("/api") && np.startsWith("/api/")) return `${nb}${np.substring(4)}`;
  return `${nb}${np}`;
};

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  license_key?: string;
  ip_address?: string;
  details?: string;
  product_name?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  "max_ips": { label: "MAX IPS", color: "text-red-500" },
  "hwid_required": { label: "HWID REQUIRED", color: "text-amber-500" },
  "success": { label: "SUCCESS", color: "text-emerald-500" },
  "failed": { label: "FAILED", color: "text-red-500" },
  "expired": { label: "EXPIRED", color: "text-red-400" },
  "banned": { label: "BANNED", color: "text-red-600" },
};

function getStatus(entry: LogEntry) {
  const action = entry.action?.toLowerCase() || "";
  if (action.includes("max") || action.includes("ip")) return statusMap["max_ips"];
  if (action.includes("hwid")) return statusMap["hwid_required"];
  if (action.includes("success") || action.includes("valid")) return statusMap["success"];
  if (action.includes("ban")) return statusMap["banned"];
  if (action.includes("expir")) return statusMap["expired"];
  return { label: action.toUpperCase().substring(0, 20), color: "text-zinc-400" };
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [logLimit, setLogLimit] = useState(50);

  useEffect(() => {
    fetchLogs();
    if (!isPaused) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(getApiUrl("/api/logs/admin/logs"), {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setLogs(await res.json());
    } catch (err) { console.error("Failed to fetch logs:", err); }
    finally { setLoading(false); }
  };

  const filteredLogs = logs
    .filter(l => !searchProduct || l.product_name?.toLowerCase().includes(searchProduct.toLowerCase()))
    .slice(0, logLimit);

  const formatDate = (ts: string) => {
    try {
      const d = new Date(ts);
      return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}, ${d.toLocaleTimeString("en-GB", { hour12: false })}`;
    } catch { return ts; }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Realtime</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">Live Monitoring</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">License API Requests</p>
        </div>

        {/* Controls bar */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">License API Requests</span>
            <div className={cn("w-2 h-2 rounded-full", isPaused ? "bg-red-500" : "bg-emerald-500 animate-pulse")} />
          </div>

          <div className="flex items-center gap-2">
            <select className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option>Product</option>
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
              <input value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} placeholder="Search by Product"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-[10px] font-bold text-white outline-none placeholder:text-zinc-700" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <select value={logLimit} onChange={(e) => setLogLimit(Number(e.target.value))}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
              <option value={50}>Show 50 Logs</option>
              <option value={100}>Show 100 Logs</option>
              <option value={250}>Show 250 Logs</option>
            </select>
            <button onClick={() => setIsPaused(!isPaused)}
              className={cn("w-9 h-9 rounded-full flex items-center justify-center transition-all",
                isPaused ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-600 hover:bg-emerald-500")}>
              {isPaused ? <Play className="w-4 h-4 text-white" /> : <Pause className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>

        {/* Log Table */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-24 text-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" /><p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading realtime data...</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-900">
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">License Key</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {filteredLogs.map((log, i) => {
                    const status = getStatus(log);
                    return (
                      <tr key={log.id || i} className="hover:bg-primary/[0.02] transition-colors">
                        <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-500">#{log.id?.substring(0, 8) || i}</span></td>
                        <td className="px-6 py-4"><span className={cn("text-[10px] font-mono font-black tracking-wider", status.color)}>{status.label}</span></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-400">{formatDate(log.timestamp)}</span></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-300">{log.license_key?.substring(0, 24) || "N/A"}</span></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-500">{log.product_name || "N/A"}</span></td>
                        <td className="px-6 py-4"><span className="text-[10px] font-mono font-bold text-zinc-500">{log.ip_address || "N/A"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <div className="py-16 text-center">
                  <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No log entries found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
