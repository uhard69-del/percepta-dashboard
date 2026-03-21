"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, User, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth Guard: Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") router.push("/dashboard");
      else router.push("/store");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const loginData = new URLSearchParams();
      loginData.append("username", formData.username);
      loginData.append("password", formData.password);

      const res = await fetch(getApiUrl("/api/login/token"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginData
      });

      if (res.ok) {
        const data = await res.json();
        const { access_token, role, username } = data;
        
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role || "user");
        localStorage.setItem("username", username || formData.username);

        if (role === "admin") router.push("/dashboard");
        else router.push("/store");
      } else {
        const data = await res.json();
        setError(data.detail || "Invalid username or password.");
      }
    } catch (e) {
      setError("Unable to connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-2">
           <div className="inline-flex p-4 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-2xl mb-4">
              <ShieldCheck className="w-10 h-10 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
           </div>
           <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Account <span className="text-indigo-500">Login</span></h1>
           <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-2">Percepta Secure Portal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
               <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
               <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="text" 
                placeholder="USERNAME"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                required
                type="password" 
                placeholder="PASSWORD"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 italic"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            {loading ? "Authenticating..." : "Login to Dashboard"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-4">
           <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
              Need an account? <a href="/register" className="text-indigo-500 hover:underline">Register Now</a>
           </p>
        </div>
      </div>

      <div className="absolute bottom-10 text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">
        Percep-Sec Uplink Terminal v4.2
      </div>
    </div>
  );
}
