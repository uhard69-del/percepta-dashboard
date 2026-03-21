"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Users, 
  Plus, 
  Search, 
  CreditCard, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Shield,
  ShoppingBag,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface Reseller {
  id: string;
  username: string;
  email?: string;
  role: string;
  credits: string;
}

export default function ResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCredits, setNewCredits] = useState("0");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedProject, setSelectedProject] = useState("All Products");

  useEffect(() => {
    fetchResellers();
  }, []);

  const fetchResellers = async () => {
    try {
      const res = await fetch(getApiUrl("/api/resellers/admin/resellers"), {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        setResellers(await res.json());
      }
    } catch (err) {
      console.error("Fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(getApiUrl("/api/resellers/admin/resellers"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          username: newUsername, 
          password: newPassword, 
          credits: newCredits,
          role: "reseller" 
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setNewUsername("");
        setNewPassword("");
        setNewCredits("0");
        fetchResellers();
        setTimeout(() => { setIsModalOpen(false); setSuccess(false); }, 1500);
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to create reseller");
      }
    } catch (err) {
      setError("Network failure");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCredits = async (id: string, amount: string) => {
     try {
        const res = await fetch(getApiUrl(`/api/resellers/admin/resellers/${id}/credits?amount=${amount}`), {
           method: "POST",
           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) fetchResellers();
     } catch (err) {
        console.error("Credit update failure", err);
     }
  };

  const handleDelete = async (id: string) => {
     if (!confirm("Are you sure? This will remove the reseller account.")) return;
     try {
        const res = await fetch(getApiUrl(`/api/resellers/admin/resellers/${id}`), {
           method: "DELETE",
           headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) fetchResellers();
     } catch (err) {
        console.error("Deletion failure", err);
     }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">
              Reseller Management
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Manage external resellers and storefront credits
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] group uppercase tracking-widest text-[9px]"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Reseller
          </button>
        </div>

        {/* Project Selector */}
        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 flex items-center gap-4">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Select Project</span>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold text-white outline-none appearance-none cursor-pointer">
            <option>All Products</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Stat Cards */}
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
              <div>
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Resellers</p>
                 <p className="text-3xl font-black text-white italic">{resellers.length}</p>
              </div>
              <Users className="w-10 h-10 text-indigo-500/20" />
           </div>
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
              <div>
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Credits Out</p>
                 <p className="text-3xl font-black text-indigo-500 italic">
                    {resellers.reduce((acc, r) => acc + parseInt(r.credits || "0"), 0)}
                 </p>
              </div>
              <CreditCard className="w-10 h-10 text-indigo-500/20" />
           </div>
           <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
              <div>
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Merchant Volume</p>
                 <p className="text-3xl font-black text-emerald-500 italic">High</p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-500/20" />
           </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {loading ? (
             <div className="py-24 text-center">
                <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading resellers...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-zinc-900">
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Username</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Status</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Credit Balance</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Role</th>
                    <th className="px-8 py-6 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {resellers.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                      <td className="px-8 py-6 italic">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                               <ShoppingBag className="w-5 h-5 text-zinc-600 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-tight">{merchant.username}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1 rounded-lg">VERIFIED</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-white italic">{merchant.credits}</span>
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Credits</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-indigo-500" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Authorized Reseller</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                             <button 
                               onClick={() => {
                                 const amt = prompt("Enter new credit amount:", merchant.credits);
                                 if (amt !== null) handleUpdateCredits(merchant.id, amt);
                               }}
                               className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[8px] font-black uppercase hover:bg-primary/20 transition-all"
                             >
                               Edit
                             </button>
                             <button 
                               className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[8px] font-black uppercase hover:bg-blue-500/20 transition-all"
                             >
                               View Keys
                             </button>
                             <button 
                               onClick={() => handleDelete(merchant.id)}
                               className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-[8px] font-black uppercase hover:bg-red-500/20 transition-all"
                             >
                                Delete
                             </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {resellers.length === 0 && (
                 <div className="py-32 text-center text-zinc-800 space-y-4">
                    <Users className="w-16 h-16 mx-auto opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">No merchants currently registered</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[2.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
              <Plus className="w-8 h-8 rotate-45" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Add New Reseller</h2>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Authorize a new reseller to sell products</p>
            </div>

            {success ? (
              <div className="py-12 text-center">
                 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Reseller Added</h3>
              </div>
            ) : (
              <form onSubmit={handleCreateReseller} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Username</label>
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white uppercase tracking-widest" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Access Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="reseller@example.com" className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Initial Balance</label>
                  <input type="number" value={newCredits} onChange={(e) => setNewCredits(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white" required />
                </div>
                <button disabled={isCreating} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest italic text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all">
                  {isCreating ? "Adding..." : "Add Reseller"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
