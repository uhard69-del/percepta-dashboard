"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { 
  Users, 
  Key, 
  Package, 
  Activity,
  ShieldAlert,
  Terminal,
  ChevronRight,
  TrendingUp,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { RadarGlobe } from "@/components/RadarGlobe";

// Robust API helper
const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

interface Log {
  id: string;
  message: string;
  timestamp: string;
  ip?: string;
}

const mockChartData = [
  { name: "01 Mar", value: 12 },
  { name: "05 Mar", value: 25 },
  { name: "10 Mar", value: 18 },
  { name: "15 Mar", value: 32 },
  { name: "20 Mar", value: 45 },
];

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
    <div className="flex-1 overflow-auto bg-[#08080A] custom-scrollbar">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Operational Dashboard</span>
            </div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">Enterprise Command</h1>
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
             <p className="text-3xl font-black text-red-500 italic">{loading ? "..." : stats.banned}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             {/* 3D Radar Section */}
             <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative h-[500px]">
                <RadarGlobe />
             </div>

             {/* Analytics Section */}
             <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Growth Matrix</h2>
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>
          </div>

          <div className="lg:col-span-1 bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8 flex flex-col h-full">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Live Security Feed</h2>
               </div>
               <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">View All Stream</button>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
               {loading ? (
                  <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Connecting to log-server...</div>
               ) : logs.length > 0 ? (
                  logs.map((log) => {
                     const isFail = log.message.toLowerCase().includes("fail") || log.message.toLowerCase().includes("ban");
                     return (
                        <div key={log.id} className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                 "w-2 h-2 rounded-full shadow-lg",
                                 isFail ? "bg-red-500" : "bg-emerald-500"
                              )} />
                              <div>
                                 <p className={cn(
                                    "text-[10px] font-black uppercase italic tracking-tight leading-none mb-1",
                                    isFail ? "text-red-500" : "text-white"
                                 )}>{log.message}</p>
                                 <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">{log.ip || "SECURE_TUNNEL"}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-3 h-3 text-zinc-800" />
                        </div>
                     );
                  })
               ) : (
                  <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No activity detected</div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
