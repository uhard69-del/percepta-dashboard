"use client";

import { Header } from "@/components/Header";
import { Code, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["Licences", "Customers", "Products", "Logs"] as const;

const endpoints: Record<string, { method: string; path: string; desc: string; params: { name: string; type: string; desc: string }[] }[]> = {
  Licences: [
    { method: "GET", path: "/api/v1/licenses", desc: "Fetch licences. Supports filtering and pagination.", params: [
      { name: "id", type: "number", desc: "Filter by licence ID" },
      { name: "customer", type: "number", desc: "Filter by customer ID" },
      { name: "product", type: "number", desc: "Filter by product ID" },
      { name: "issue_date", type: "ISO string", desc: "Filter by issue date" },
      { name: "expiration", type: "ISO string", desc: "Filter by expiration date" },
      { name: "status", type: "string", desc: "Filter by status (active, expired, banned)" },
    ]},
    { method: "POST", path: "/api/v1/licenses", desc: "Create a new licence.", params: [
      { name: "product_id", type: "number", desc: "The product to associate" },
      { name: "customer_id", type: "number", desc: "The customer to associate" },
      { name: "max_ips", type: "number", desc: "Maximum allowed IPs" },
      { name: "max_hwids", type: "number", desc: "Maximum allowed HWIDs" },
      { name: "expiration", type: "ISO string", desc: "Expiration date" },
    ]},
    { method: "DELETE", path: "/api/v1/licenses/:id", desc: "Delete a licence by ID.", params: [{ name: "id", type: "number", desc: "The licence ID (path param)" }] },
  ],
  Customers: [
    { method: "GET", path: "/api/v1/customers", desc: "Fetch customers. Supports filtering.", params: [
      { name: "id", type: "string", desc: "Filter by customer ID" },
      { name: "name", type: "string", desc: "Filter by name" },
      { name: "email", type: "string", desc: "Filter by email" },
      { name: "discord_id", type: "string", desc: "Filter by Discord ID" },
    ]},
    { method: "POST", path: "/api/v1/customers", desc: "Create a new customer.", params: [
      { name: "name", type: "string", desc: "Customer name" },
      { name: "email", type: "string", desc: "Customer email" },
      { name: "discord_id", type: "string", desc: "Discord user ID" },
    ]},
  ],
  Products: [
    { method: "GET", path: "/api/v1/products", desc: "Fetch products.", params: [
      { name: "id", type: "number", desc: "Filter by product ID" },
      { name: "name", type: "string", desc: "Filter by product name" },
    ]},
    { method: "POST", path: "/api/v1/products", desc: "Create a new product.", params: [
      { name: "name", type: "string", desc: "Product name" },
      { name: "price", type: "number", desc: "Product price" },
      { name: "version", type: "string", desc: "Product version" },
    ]},
  ],
  Logs: [
    { method: "GET", path: "/api/v1/logs", desc: "Fetch API request logs.", params: [
      { name: "product", type: "number", desc: "Filter by product ID" },
      { name: "license_key", type: "string", desc: "Filter by license key" },
      { name: "status", type: "string", desc: "Filter by status" },
      { name: "limit", type: "number", desc: "Number of logs to return (default: 50)" },
    ]},
  ],
};

export default function ApiPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Licences");
  const [copiedPath, setCopiedPath] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(text);
    setTimeout(() => setCopiedPath(""), 2000);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1200px] mx-auto space-y-8 pb-20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Developer</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">API</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50")}>
              {tab}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          Secure REST API for managing {activeTab.toLowerCase()}.
        </div>

        {/* Base URL */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-3">Base URL</h3>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 font-mono text-xs text-zinc-300">
            /api/v1/{activeTab.toLowerCase()}
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-black text-white">Authentication</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Provide your API key using one of the following headers:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-600">•</span>
              <code className="bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-primary">x-api-key: YOUR_API_KEY</code>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[9px] text-zinc-600">•</span>
              <code className="bg-zinc-900/50 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-primary">Authorization: Bearer YOUR_API_KEY</code>
            </li>
          </ul>
        </div>

        {/* Endpoints */}
        {endpoints[activeTab]?.map((ep, i) => (
          <div key={i} className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-black uppercase px-3 py-1 rounded-lg",
                ep.method === "GET" ? "bg-emerald-500/10 text-emerald-500" :
                ep.method === "POST" ? "bg-blue-500/10 text-blue-500" :
                "bg-red-500/10 text-red-500")}>
                {ep.method}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-300">{ep.path}</span>
              <button onClick={() => copyToClipboard(ep.path)} className="ml-auto text-zinc-600 hover:text-white transition-all">
                {copiedPath === ep.path ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold">{ep.desc}</p>

            {ep.params.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Query parameters</h4>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-900">
                      <th className="py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Name</th>
                      <th className="py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Type</th>
                      <th className="py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map((p) => (
                      <tr key={p.name} className="border-b border-zinc-900/50">
                        <td className="py-2"><code className="text-[10px] font-mono text-primary">{p.name}</code></td>
                        <td className="py-2"><span className="text-[10px] font-bold text-zinc-500">{p.type}</span></td>
                        <td className="py-2"><span className="text-[10px] font-bold text-zinc-500">{p.desc}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
