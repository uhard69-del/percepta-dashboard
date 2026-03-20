"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  ChevronRight, 
  AlertCircle,
  Zap,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    discord_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "https://percepta-backend.onrender.com";
      const res = await fetch(`${base}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.detail || "Registration failed. Frequency interference detected.");
      }
    } catch (e) {
      setError("Network link unstable. Please retry uplink.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none" />
      
      <Link href="/store" className="absolute top-10 left-10 flex items-center gap-2 group text-zinc-500 hover:text-white transition-all">
         <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 group-hover:border-indigo-500/30 transition-all">
            <ChevronRight className="w-4 h-4 rotate-180" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest italic">Back to Store</span>
      </Link>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
           <div className="inline-flex p-4 rounded-3xl bg-zinc-950 border border-zinc-900 shadow-2xl mb-2">
              <ShieldCheck className="w-10 h-10 text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Initialize <span className="text-indigo-500">Access</span></h1>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-2">Establish your secure node identity</p>
           </div>
        </div>

        {success ? (
          <div className="p-8 bg-zinc-950/80 border border-emerald-500/20 rounded-[2.5rem] text-center space-y-4 animate-in fade-in zoom-in duration-500">
             <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
             </div>
             <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Link Established</h2>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                Your account has been encrypted and synced. <br />
                Redirecting to secure login...
             </p>
             <div className="flex justify-center pt-4">
                 <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-10 shadow-2xl space-y-6">
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
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
               </div>

               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    required
                    type="email" 
                    placeholder="SECURE EMAIL"
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
               </div>

               <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    required
                    type="password" 
                    placeholder="SECRET KEY (PASSWORD)"
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
               </div>

               <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors flex items-center justify-center">
                     <span className="text-[10px] font-black italic">D</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="DISCORD ID (OPTIONAL)"
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                    value={formData.discord_id}
                    onChange={(e) => setFormData({...formData, discord_id: e.target.value})}
                  />
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 italic"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
              {loading ? "Transmitting..." : "Initialize Node"}
            </button>

            <div className="text-center pt-4">
               <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                  Existing node member? <Link href="/login" className="text-indigo-500 hover:underline">Access Link</Link>
               </p>
            </div>
          </form>
        )}
      </div>

      <div className="absolute bottom-10 text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">
        Percep-Sec Uplink Terminal v4.2
      </div>
    </div>
  );
}
