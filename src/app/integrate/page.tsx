"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { 
  Terminal, 
  Code2, 
  BookOpen, 
  Play, 
  Copy, 
  Check, 
  ChevronRight,
  Globe,
  Cpu,
  Shield,
  Zap,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { id: "python", name: "Python", icon: Globe, color: "text-blue-400" },
  { id: "csharp", name: "C# / .NET", icon: Cpu, color: "text-purple-400" },
  { id: "cpp", name: "C++ / Native", icon: Shield, color: "text-blue-600" },
  { id: "lua", name: "Lua / Scripting", icon: Zap, color: "text-indigo-400" },
];

const snippets: Record<string, string> = {
  python: `import requests

API_KEY = "YOUR_LICENSE_KEY"
BASE_URL = "https://api.percepta.ai/v1"

def authenticate():
    response = requests.post(
        f"{BASE_URL}/auth/verify",
        json={"key": API_KEY, "hwid": "AUTO_GENERATE"}
    )
    if response.status_code == 200:
        print("PERCEPTA_SECURE: LINK_ESTABLISHED")
        return response.json()["session_token"]
    return None`,
  csharp: `using System.Net.Http;
using System.Text.Json;

public class PerceptaClient {
    private const string API_URL = "https://api.percepta.ai/v1";
    
    public async Task<bool> Verify(string key) {
        var client = new HttpClient();
        var payload = new { key = key, hwid = GetHWID() };
        var response = await client.PostAsync(API_URL + "/verify", 
            new StringContent(JsonSerializer.Serialize(payload)));
        return response.IsSuccessStatusCode;
    }
}`,
  cpp: `#include <percepta_sdk.h>

int main() {
    Percepta::Session session("YOUR_LICENSE_KEY");
    
    if (session.Initialize()) {
        printf("S3_LINK_ESTABLISHED\\n");
        // Start protected runtime
        session.HeartbeatLoop();
    }
    
    return 0;
}`,
  lua: `local percepta = require("percepta")

local client = percepta.new("YOUR_KEY")

client:on("link", function()
    print("LOG: Link established with Stage-3")
end)

client:verify()`
};

export default function IntegratePage() {
  const [activeLang, setActiveLang] = useState("python");
  const [copied, setCopied] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runTest = () => {
    setIsTesting(true);
    setTestResponse(null);
    setTimeout(() => {
      setTestResponse(JSON.stringify({
        status: "SUCCESS",
        session: "sess_912384x",
        expires: "2026-12-31",
        features: ["aimbot", "esp", "radar_v5"]
      }, null, 2));
      setIsTesting(false);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Developer Portal</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Integrate Hub</h1>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-[10px] font-black text-white hover:border-indigo-500/30 transition-all uppercase tracking-widest italic group">
             <BookOpen className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
             Read Full Docs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* SDK Selector & Snippet */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                <div className="flex flex-wrap gap-4">
                    {languages.map((lang) => (
                        <button 
                            key={lang.id}
                            onClick={() => setActiveLang(lang.id)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-4 border rounded-2xl transition-all duration-300 group",
                                activeLang === lang.id 
                                    ? "bg-indigo-500/10 border-indigo-500/30 text-white" 
                                    : "bg-zinc-900/40 border-zinc-900 text-zinc-500 hover:border-zinc-800"
                            )}
                        >
                            <lang.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", lang.color)} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{lang.name}</span>
                        </button>
                    ))}
                </div>

                <div className="relative group/code">
                    <div className="absolute top-4 right-4 z-10">
                        <button 
                            onClick={handleCopy}
                            className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-600 hover:text-white hover:border-zinc-700 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                    <pre className="bg-[#050505] border border-zinc-900 rounded-[2rem] p-8 overflow-x-auto font-mono text-sm group-hover/code:border-indigo-500/20 transition-all">
                        <code className="text-zinc-300 leading-relaxed block whitespace-pre">
                            {snippets[activeLang]}
                        </code>
                    </pre>
                </div>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Available Endpoints</h3>
                <div className="space-y-3">
                    {[
                        { method: "POST", path: "/auth/verify", desc: "Validate license key and establish session" },
                        { method: "GET", path: "/user/stats", desc: "Retrieve usage metrics and active relay status" },
                        { method: "PATCH", path: "/security/hwid", desc: "Update hardware fingerprinting affinity" },
                    ].map((ep) => (
                        <div key={ep.path} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl group hover:border-zinc-800 transition-all">
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "px-2 py-1 rounded text-[8px] font-black tracking-widest uppercase",
                                    ep.method === "POST" ? "text-indigo-500 bg-indigo-500/10" : 
                                    ep.method === "GET" ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                                )}>{ep.method}</span>
                                <code className="text-[10px] font-bold text-zinc-400 font-mono tracking-widest">{ep.path}</code>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">{ep.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* API Tester Terminal */}
          <div className="space-y-6">
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl h-[700px]">
                <div className="p-6 bg-zinc-900/20 border-b border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                        </div>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Secure Link Tester</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
                    </div>
                </div>

                <div className="p-8 flex-1 flex flex-col space-y-6">
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Mock Payload</label>
                        <textarea 
                            className="w-full bg-[#050505] border border-zinc-900 rounded-2xl p-4 font-mono text-[10px] text-indigo-400 min-h-[120px] resize-none focus:border-indigo-500/30 outline-none transition-all"
                            defaultValue={JSON.stringify({ key: "PRCP-XXXX-XXXX", hwid: "721x-a92c-0021" }, null, 2)}
                        />
                    </div>

                    <button 
                        onClick={runTest}
                        disabled={isTesting}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 italic"
                    >
                        {isTesting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Play className="w-4 h-4 fill-current" />
                        )}
                        {isTesting ? "Executing Request..." : "Run Test Probe"}
                    </button>

                    <div className="flex-1 flex flex-col space-y-3">
                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Relay Response</label>
                        <div className="flex-1 bg-black border border-zinc-900 rounded-2xl p-6 font-mono text-[10px] text-zinc-500 overflow-auto relative">
                            {testResponse ? (
                                <pre className="text-emerald-500/80 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {testResponse}
                                </pre>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-[8px] font-black uppercase tracking-[0.4em] italic">
                                    Awaiting Execution...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-zinc-900/10 border-t border-zinc-900 text-center">
                    <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest italic">Encrypted Secure Tunnel Enabled</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
