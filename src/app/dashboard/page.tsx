"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { 
  Users, 
  Key, 
  Package, 
  Activity,
  ShieldCheck,
  Zap,
  Clock,
  ShieldAlert,
  Terminal,
  ChevronRight
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
  message: string;
  timestamp: string;
  ip?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, licenses: 0, products: 0, active: 0, banned: 0 });
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, licRes, logRes] = await Promise.all([
          fetch(getApiUrl("/api/products/admin/products")),
          fetch(getApiUrl("/api/licenses/admin/licenses")),
          fetch(getApiUrl("/api/licenses/admin/logs"))
        ]);

        if (prodRes.ok && licRes.ok && logRes.ok) {
          const products = await prodRes.json();
          const licenses = await licRes.json();
          const logsData = await logRes.json();
          
          setStats({
            users: new Set(licenses.map((l: any) => l.hwid).filter(Boolean)).size,
            licenses: licenses.length,
            products: products.length,
            active: licenses.filter((l: any) => l.status === "active").length,
            banned: licenses.filter((l: any) => l.status === "banned").length
          });
          setLogs(logsData.slice(0, 10)); // Top 10 latest
        }
      } catch (error) {
        console.error("Fetch failure:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">Enterprise Command</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">Global security heuristics and commercial metrics</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center gap-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Node: US-EAST-1</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard title="Total Users" value={loading ? "..." : stats.users.toString()} icon={Users} />
          <StatCard title="Licenses" value={loading ? "..." : stats.licenses.toString()} icon={Key} />
          <StatCard title="Active" value={loading ? "..." : stats.active.toString()} icon={Activity} />
          <StatCard title="Merchant Units" value={loading ? "..." : stats.products.toString()} icon={Package} />
          <div className="bg-zinc-950/50 border border-red-500/10 rounded-[2rem] p-6 shadow-2xl group hover:border-red-500/30 transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><ShieldAlert className="w-5 h-5 text-red-500" /></div>
             </div>
             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Banned Assets</p>
             <p className="text-3xl font-black text-red-500 italic">{loading ? "..." : stats. b   b  b   b  b  b  b   b     b   b     b  b  b    b  b  b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   status   b  b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b    b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   b   status.banned}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Activity Feed */}
          <div className="lg:col-span-2 bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Live Security Feed</h2>
               </div>
               <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">View All Stream</button>
            </div>
            
            <div className="space-y-4">
               {loading ? (
                  <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Connecting to log-server...</div>
               ) : logs.length > 0 ? (
                  logs.map((log) => {
                     const isFail = log.message.toLowerCase().includes("fail");
                     return (
                        <div key={log.id} className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 isFail ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                              )} />
                              <div>
                                 <p className={cn(
                                    "text-[11px] font-black uppercase italic tracking-tight leading-none mb-1",
                                    isFail ? "text-red-500" : "text-white"
                                 )}>{log.message}</p>
                                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">{log.ip || "SECURE_TUNNEL"}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest leading-none mb-1">
                                 {new Date(log.timestamp).toLocaleTimeString()}
                              </p>
                              <ChevronRight className="w-3 h-3 text-zinc-800 ml-auto group-hover:text-zinc-600 transition-colors" />
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No activity detected in buffer</div>
               )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-lg font-black text-white uppercase italic tracking-widest mb-6 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-indigo-500" />
                 Cloud Matrix
              </h2>
              <div className="space-y-6">
                {[
                  { l: "Security Node", v: "ESTABLISHED", c: "text-emerald-500" },
                  { l: "DB Replication", v: "SYNCHRONIZED", c: "text-emerald-500" },
                  { l: "Traffic Proxy", v: "OPTIMIZED", c: "text-indigo-500" },
                  { l: "System Build", v: "v2.0.8-ALPHA", c: "text-zinc-600" }
                ].map((item) => (
                  <div key={item.l} className="flex justify-between items-center bg-zinc-900/20 p-4 rounded-xl border border-zinc-900/50">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.l}</span>
                     <span className={cn("text-[10px] font-black uppercase italic tracking-widest", item.c)}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-primary rounded-[2.5rem] p-8 shadow-2xl text-white overflow-hidden relative group cursor-pointer">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Security Protocol</p>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Anti-Dump Active</h3>
                  <p className="text-xs font-medium opacity-70 leading-relaxed">
                     Hardware-level execution shielding is currently active across all verified modules.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
