"use client";

import { useState } from "react";
import { ShieldCheck, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth for now, later we'll add real API call
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-6 z-[9999] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-[400px] relative z-20">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-zinc-950 border border-zinc-900 mb-6 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic mb-1">
            Percepta<span className="text-primary italic">AI</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            Secure Admin Gateway
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="ADMINISTRATOR ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all uppercase"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="SECURITY KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-primary/30 uppercase tracking-widest italic text-sm mt-6 disabled:opacity-50"
          >
            {isLoading ? "Synchronizing..." : "Initialize Session"}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center opacity-40">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-loose">
            Security Protocol 88-X Active
            <br />
            IP & HWID logging enforced
          </p>
        </div>
      </div>
    </div>
  );
}
