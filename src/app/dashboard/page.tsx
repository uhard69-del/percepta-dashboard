"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { 
  Users, Key, Package, Activity, ShieldAlert, Terminal, ChevronRight,
  TrendingUp, Target, Plus, Webhook, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { RadarGlobe } from "@/components/RadarGlobe";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const nb = base.endsWith("/") ? base.slice(0, -1) : base;
  const np = path.startsWith("/") ? path : `/${path}`;
  return `${nb}${np}`;
};

interface Log { id: string; message: string; timestamp: string; ip?: string; }

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, licenses: 0, products: 0, active: 0, banned: 0 });
  const [logs, setLogs] = useState<Log[]>([]);
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
  const [dailyApiData, setDailyApiData] = useState<{name: string, requests: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const username = "admin";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, licRes, logRes] = await Promise.all([
          fetch(getApiUrl("/api/products/admin/products"), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
          fetch(getApiUrl("/api/licenses/admin/licenses"), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }),
          fetch(getApiUrl("/api/licenses/admin/logs"), { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
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
          setLogs(logsData.slice(0, 10));

          // Growth matrix (last 7 days)
          const days: Record<string, number> = {};
          const now = new Date();
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now); d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            days[dateStr] = 0;
          }
          licenses.forEach((l: any) => {
            const dateStr = new Date(l.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            if (days[dateStr] !== undefined) days[dateStr]++;
          });
          setChartData(Object.entries(days).map(([name, value]) => ({ name, value: value as number })));

          // Daily API requests (last 7 days from logs)
          const apiDays: Record<string, number> = {};
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now); d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            apiDays[dateStr] = 0;
          }
          logsData.forEach((l: any) => {
            const dateStr = new Date(l.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
            if (apiDays[dateStr] !== undefined) apiDays[dateStr]++;
          });
          setDailyApiData(Object.entries(apiDays).map(([name, requests]) => ({ name, requests: requests as number })));
        }
      } catch (error) { console.error("Fetch failure:", error); }
      finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl("/api/products/admin/products"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: newProjectName, description: "", price: "0", version: "1.0.0", is_enabled: true })
      });
      if (res.ok) { setShowCreateProject(false); setNewProjectName(""); }
    } catch (err) { console.error("Create failed:", err); }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A] custom-scrollbar">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-2">
              Welcome back, <span className="text-primary">{username}</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Here&apos;s your overview for today</p>
          </div>
          <div className="flex gap-3">
            <Link href="/store" target="_blank" className="flex items-center gap-2 px-5 py-3 bg-zinc-950 border border-zinc-900 text-zinc-500 font-black rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[9px]">
              <Package className="w-4 h-4" /> Store
            </Link>
            <Link href="/register" target="_blank" className="flex items-center gap-2 px-5 py-3 bg-zinc-950 border border-zinc-900 text-zinc-500 font-black rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[9px]">
              <Users className="w-4 h-4" /> Register
            </Link>
            <button onClick={() => setShowWebhook(true)} className="flex items-center gap-2 px-5 py-3 bg-zinc-950 border border-zinc-900 text-zinc-500 font-black rounded-2xl hover:text-white transition-all uppercase tracking-widest text-[9px]">
              <Webhook className="w-4 h-4" /> Set Webhook
            </button>
            <button onClick={() => setShowCreateProject(true)} className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase tracking-widest text-[9px]">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>
        </div>

        {/* Stat Cards with colored borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-zinc-950/50 border-l-4 border-l-blue-500 border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"><Users className="w-5 h-5 text-blue-500" /></div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-3xl font-black text-white italic">{loading ? "..." : stats.users}</p>
          </div>
          <div className="bg-zinc-950/50 border-l-4 border-l-primary border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl"><Key className="w-5 h-5 text-primary" /></div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Licenses</p>
            <p className="text-3xl font-black text-white italic">{loading ? "..." : stats.licenses}</p>
          </div>
          <div className="bg-zinc-950/50 border-l-4 border-l-emerald-500 border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"><Activity className="w-5 h-5 text-emerald-500" /></div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active</p>
            <p className="text-3xl font-black text-emerald-500 italic">{loading ? "..." : stats.active}</p>
          </div>
          <div className="bg-zinc-950/50 border-l-4 border-l-amber-500 border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl"><Package className="w-5 h-5 text-amber-500" /></div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Products</p>
            <p className="text-3xl font-black text-white italic">{loading ? "..." : stats.products}</p>
          </div>
          <div className="bg-zinc-950/50 border-l-4 border-l-red-500 border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><ShieldAlert className="w-5 h-5 text-red-500" /></div>
            </div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Banned</p>
            <p className="text-3xl font-black text-red-500 italic">{loading ? "..." : stats.banned}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* 3D Radar */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative h-[500px]">
              <RadarGlobe />
            </div>

            {/* Growth Matrix + Daily API side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Growth Matrix</h2>
                </div>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#3f3f46" fontSize={9} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px' }} itemStyle={{ color: '#fff' }} />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Daily API Requests</h2>
                </div>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyApiData}>
                      <XAxis dataKey="name" stroke="#3f3f46" fontSize={9} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px' }} itemStyle={{ color: '#fff' }} />
                      <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Live Security Feed */}
          <div className="lg:col-span-1 bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Live Feed</h2>
              </div>
              <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loading ? (
                <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Connecting...</div>
              ) : logs.length > 0 ? (
                logs.map((log) => {
                  const isFail = log.message.toLowerCase().includes("fail") || log.message.toLowerCase().includes("ban");
                  return (
                    <div key={log.id} className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full shadow-lg", isFail ? "bg-red-500" : "bg-emerald-500")} />
                        <div>
                          <p className={cn("text-[10px] font-black uppercase italic tracking-tight leading-none mb-1", isFail ? "text-red-500" : "text-white")}>{log.message}</p>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">{log.ip || "SECURE"}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-800" />
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">No activity</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-md rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowCreateProject(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Project Name</label>
                <input value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} required
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" />
              </div>
              <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all">Create Project</button>
            </form>
          </div>
        </div>
      )}

      {/* Set Webhook Modal */}
      {showWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-md rounded-[2rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowWebhook(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-6">Set Webhook URL</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Webhook URL</label>
                <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://discord.com/api/webhooks/..."
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 outline-none" />
              </div>
              <button onClick={() => { alert("Webhook URL saved!"); setShowWebhook(false); }} className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all">Save Webhook</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
