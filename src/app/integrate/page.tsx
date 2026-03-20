"use client";

import { Header } from "@/components/Header";
import { 
  Code, Copy, CheckCircle2, Key, Webhook, ShoppingBag, Zap
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const codeSnippets: Record<string, string> = {
  "Node.js": `const response = await fetch('https://api.perceptaai.com/api/license', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "LICENSE_KEY": process.env.LICENSE_KEY // Replace with the license key
  },
});
const data = await response.json();`,

  "Axios": `const { data } = await axios.post('https://api.perceptaai.com/api/license', {}, {
  headers: {
    "Content-Type": "application/json",
    "LICENSE_KEY": process.env.LICENSE_KEY
  }
});`,

  "Python": `import requests

response = requests.post('https://api.perceptaai.com/api/license', 
  headers={
    "Content-Type": "application/json",
    "LICENSE_KEY": os.environ.get("LICENSE_KEY")
  }
)
data = response.json()`,

  "Java": `HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("https://api.perceptaai.com/api/license"))
  .header("Content-Type", "application/json")
  .header("LICENSE_KEY", System.getenv("LICENSE_KEY"))
  .POST(HttpRequest.BodyPublishers.noBody())
  .build();
HttpResponse<String> response = client.send(request, 
  HttpResponse.BodyHandlers.ofString());`,

  "Lua": `local http = require("socket.http")
local ltn12 = require("ltn12")
local response = {}
http.request{
  url = "https://api.perceptaai.com/api/license",
  method = "POST",
  headers = {
    ["Content-Type"] = "application/json",
    ["LICENSE_KEY"] = LICENSE_KEY
  },
  sink = ltn12.sink.table(response)
}`,

  "Go": `req, _ := http.NewRequest("POST", "https://api.perceptaai.com/api/license", nil)
req.Header.Set("Content-Type", "application/json")
req.Header.Set("LICENSE_KEY", os.Getenv("LICENSE_KEY"))
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
body, _ := io.ReadAll(resp.Body)`,
};

const obfuscatedSnippet = `function _0x1158(_0x58cde9,_0x381603){const _0x4ebe9c=_0x4ebe();return _0x1158=fun...`;

const apiResponse = `{
  "status": "success",
  "success": true,
  "message": "License key is valid",
  "license": {
    "license_key": "cf849418-d22d-42e4-9b56-121a8b...",
    "status": "active",
    "expires_at": "2026-01-01T00:00:00Z",
    "issue_date": "2024-12-12T00:00:00Z",
    "customer": "demo",
    "product": "PerceptaAI Pro",
    "max_ips": 1,
    "max_hwids": 1,
    "ip_address": "86.121.67.31"
  }
}`;

const responseFields = [
  { name: "status", type: "String", desc: "The status of the license key" },
  { name: "success", type: "Boolean", desc: "Whether the license key check passed" },
  { name: "message", type: "String", desc: "The message of the license key request" },
  { name: "license", type: "Object", desc: "The license object containing all details" },
];

const sidebarItems = [
  { icon: ShoppingBag, label: "Product Integration", active: true },
  { icon: Zap, label: "Automation", active: false },
  { icon: Webhook, label: "Webhooks", active: false },
];

export default function IntegratePage() {
  const [activeLang, setActiveLang] = useState("Node.js");
  const [copied, setCopied] = useState("");
  const [testKey, setTestKey] = useState("");

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Developer</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Integration</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Integrate PerceptaAI with ease</p>
          </div>
          <button onClick={() => { const key = prompt("Enter a license key to test:"); if (key) setTestKey(key); }}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase tracking-widest text-[9px]">
            <Key className="w-4 h-4" /> Test License Key
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0 space-y-2">
            {sidebarItems.map((item) => (
              <button key={item.label}
                className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                  item.active ? "bg-primary/10 text-primary" : "text-zinc-500 hover:text-white hover:bg-zinc-900/50")}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-10">
            {/* Regular Example */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-black text-white">Integrate PerceptaAI into your product (regular example)</h2>
              <p className="text-[11px] text-zinc-500">We&apos;ve made it dead simple to integrate PerceptaAI into your product - no libraries required. The example below fetches the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono text-[10px]">LICENSE_KEY</code> from the environment variable.</p>

              {/* Endpoint */}
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg">POST</span>
                <span className="font-mono text-xs text-zinc-300">https://api.perceptaai.com/api/license</span>
              </div>

              {/* Headers + Code side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-black text-white">Headers</h3>
                  <div>
                    <code className="text-primary font-mono text-xs font-bold">LICENSE_KEY</code>
                    <p className="text-[10px] text-zinc-500 mt-1">The license key for the product.</p>
                    <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-1">Required</p>
                  </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                  {/* Language tabs */}
                  <div className="flex border-b border-zinc-800 overflow-x-auto">
                    {Object.keys(codeSnippets).map((lang) => (
                      <button key={lang} onClick={() => setActiveLang(lang)}
                        className={cn("px-4 py-2.5 text-[10px] font-bold whitespace-nowrap transition-all",
                          activeLang === lang ? "text-primary border-b-2 border-primary" : "text-zinc-500 hover:text-white")}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  <div className="relative p-4">
                    <pre className="text-[10px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">{codeSnippets[activeLang]}</pre>
                    <button onClick={() => copyText(codeSnippets[activeLang], "code")}
                      className="absolute top-3 right-3 p-2 bg-zinc-800/80 rounded-lg text-zinc-400 hover:text-white transition-all">
                      {copied === "code" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Note callout */}
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">NOTE</p>
                <p className="text-[10px] text-blue-300">You can also pass <code className="font-mono bg-blue-500/10 px-1 py-0.5 rounded">ip_address</code> and <code className="font-mono bg-blue-500/10 px-1 py-0.5 rounded">license_key</code> in the request body if you don&apos;t want to/can&apos;t use the headers.</p>
              </div>
            </div>

            {/* Obfuscated Example */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-black text-white">Integrate PerceptaAI into your product (obfuscated example)</h2>
              <p className="text-[11px] text-zinc-500">The example below fetches the <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono text-[10px]">LICENSE_KEY</code> from the environment variable and is obfuscated. You can use tools such as <span className="text-primary">Obfuscator.io</span> to obfuscate code yourself.</p>

              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-lg">POST</span>
                <span className="font-mono text-xs text-zinc-300">https://api.perceptaai.com/api/license</span>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4">
                <pre className="text-[10px] font-mono text-zinc-500 whitespace-pre-wrap">{obfuscatedSnippet}</pre>
              </div>
            </div>

            {/* API Response */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-black text-white">API Response</h2>
              <p className="text-[11px] text-zinc-500">On every API call made to PerceptaAI in your products, you will receive a JSON response which will contain the license key status, whether the license key check passed, and the license key data. You can use this to determine if the license key is valid and to enable/disable features in your product or your product entirely.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {responseFields.map((f) => (
                    <div key={f.name} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-white">{f.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{f.type}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 relative">
                  <pre className="text-[10px] font-mono whitespace-pre-wrap leading-relaxed">
                    <span className="text-zinc-400">{"{"}</span>{"\n"}
                    <span className="text-emerald-400">{`  "status"`}</span>: <span className="text-amber-400">{`"success"`}</span>,{"\n"}
                    <span className="text-emerald-400">{`  "success"`}</span>: <span className="text-blue-400">true</span>,{"\n"}
                    <span className="text-emerald-400">{`  "message"`}</span>: <span className="text-amber-400">{`"License key is valid"`}</span>,{"\n"}
                    <span className="text-emerald-400">{`  "license"`}</span>: <span className="text-zinc-400">{"{"}</span>{"\n"}
                    <span className="text-emerald-400">{`    "license_key"`}</span>: <span className="text-amber-400">{`"cf849418-d22d-42e4-9b56-121a8b..."`}</span>,{"\n"}
                    <span className="text-emerald-400">{`    "status"`}</span>: <span className="text-amber-400">{`"active"`}</span>,{"\n"}
                    <span className="text-emerald-400">{`    "expires_at"`}</span>: <span className="text-amber-400">{`"2026-01-01T00:00:00Z"`}</span>,{"\n"}
                    <span className="text-emerald-400">{`    "issue_date"`}</span>: <span className="text-amber-400">{`"2024-12-12T00:00:00Z"`}</span>{"\n"}
                    <span className="text-zinc-400">{`  }`}</span>{"\n"}
                    <span className="text-zinc-400">{"}"}</span>
                  </pre>
                  <button onClick={() => copyText(apiResponse, "response")} className="absolute top-3 right-3 p-2 bg-zinc-800/80 rounded-lg text-zinc-400 hover:text-white transition-all">
                    {copied === "response" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
