"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  ShoppingCart, 
  ShieldCheck, 
  Zap, 
  Target, 
  ChevronRight,
  TrendingUp,
  Search,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  version: string;
  stock_limit: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState("Member");

  const categories = ["All", "Aimbot", "ESP", "Misc", "Bundles"];

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [procuring, setProcuring] = useState(false);
  const [userCredits, setUserCredits] = useState("0.00");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    setUserRole(role);
    setUsername(localStorage.getItem("username") || "Member");
    setUserCredits(localStorage.getItem("credits") || "0.00");

    const fetchProducts = async () => {
      try {
        const res = await fetch(getApiUrl("/api/products/public/list"));
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (e) {
        console.error("Store fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleProcure = async () => {
    if (!selectedProduct) return;
    setProcuring(true);
    try {
      const res = await fetch(getApiUrl(`/api/licenses/claim/${selectedProduct.id}`), {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert(`SUCCESS: Protocol ${selectedProduct.name} has been synchronized with your Vault.\nNeural Tax Applied: ${userRole === 'reseller' ? selectedProduct.price + ' Credits' : '$' + selectedProduct.price}\n\nYour Key: ${data.key || "Available in Vault"}`);
        if (data.new_balance) {
            setUserCredits(data.new_balance);
            localStorage.setItem("credits", data.new_balance);
        }
        setShowCheckout(false);
      } else {
        const err = await res.json();
        alert(err.detail || "Frequency Intercepted. Procurement Failed.");
      }
    } catch (err) {
      alert("Network link unstable.");
    } finally {
      setProcuring(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#08080A] text-white selection:bg-indigo-500/30">
      {/* Public Header */}
      <nav className="h-24 border-b border-zinc-900/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/store" className="p-1 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl flex items-center justify-center hover:border-indigo-500/30 transition-all">
                <img src="/logo.png" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" alt="PerceptaAI Logo" />
             </Link>
             <span className="text-xl font-black tracking-tighter uppercase italic">
                Percepta<span className="text-indigo-500 italic">AI</span>
             </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
             <button onClick={() => window.location.href = "/store"} className="text-[10px] font-black uppercase tracking-[0.2em] text-white transition-colors border-b-2 border-indigo-500 pb-1">Marketplace</button>
             <button onClick={() => window.open(getApiUrl("/docs"), "_blank")} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Documentation</button>
             <button onClick={() => {
                 const start = Date.now();
                 fetch(getApiUrl("/")).then(() => {
                     alert(`Network Status: STABLE\nLatency: ${Date.now() - start}ms\nAll Nodes Active`);
                 }).catch(() => alert("Network OFFLINE. API Unreachable."));
             }} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Network Status</button>
          </div>

          <div className="flex items-center gap-4">
             {isLoggedIn ? (
               <>
                 <Link href="/inventory" className="flex items-center gap-2 px-6 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/5">
                    <Package className="w-4 h-4" /> Intelligence Vault
                 </Link>
                 {(userRole === "admin" || userRole === "reseller") && (
                   <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex flex-col items-center">
                      <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Available Credits</span>
                      <span className="text-[11px] font-black text-white italic">${userCredits}</span>
                   </div>
                 )}
                 <div className="h-10 w-[1px] bg-zinc-900 mx-2" />
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">
                        {userRole === "reseller" ? "Neural Reseller" : userRole === "admin" ? "Master Admin" : "Authenticated"}
                    </span>
                    <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">{username}</span>
                 </div>
                 {isAdmin ? (
                   <Link href="/dashboard" className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:border-indigo-500/30 transition-all">Admin Control</Link>
                 ) : (
                   <button onClick={handleLogout} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all">
                      <Users className="w-4 h-4" />
                   </button>
                 )}
               </>
             ) : (
               <>
                 <Link href="/login" className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">Sign In</Link>
                 <Link href="/register" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/10 active:scale-95 group">
                    <span className="flex items-center gap-2">
                        Start Protection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                 </Link>
               </>
             )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-24 px-8 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none" />
         <div className="max-w-[1400px] mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
                <Zap className="w-3 h-3 text-indigo-500" />
                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em]">Next-Gen Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                Percepta <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient">Network</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest italic opacity-60">
                Deploy advanced security nodes and automated aim-protocols <br />
                across the globally distributed Percepta network.
            </p>
         </div>
      </div>

      {/* Store Controls */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 space-y-12 pb-32">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y border-zinc-900/50">
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border",
                            activeCategory === cat 
                                ? "bg-indigo-600 border-indigo-500 text-white" 
                                : "bg-zinc-900/40 border-zinc-900 text-zinc-500 hover:border-zinc-800"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                    type="text"
                    placeholder="SCAN NETWORK FOR PROTOCOLS..."
                    className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
         </div>

         {/* Product Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                [1,2,3].map(i => (
                    <div key={i} className="h-96 bg-zinc-900/20 border border-zinc-900 rounded-[2.5rem] animate-pulse" />
                ))
            ) : filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                    <div key={product.id} className="group relative bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Target className="w-32 h-32 text-indigo-500" />
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                                <Package className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div className="text-right">
                                <span className="block text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">{userRole === 'reseller' ? 'Neural Tax' : 'Price Point'}</span>
                                <span className="text-2xl font-black text-white italic">{userRole === 'reseller' ? `${product.price} CR` : `$${product.price}`}</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 relative z-10 text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[7px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</span>
                                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[7px] font-black text-zinc-600 uppercase tracking-widest">v{product.version}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors uppercase leading-tight">
                                {product.name}
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-2">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between py-6 border-y border-zinc-900/50 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1 text-right block">StockPool</span>
                                <span className="text-[10px] font-black text-white uppercase italic">{product.stock_limit > "0" ? `${product.stock_limit} units` : "ON-DEMAND"}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                if (!isLoggedIn) {
                                  window.location.href = `/register?product=${product.id}`;
                                  return;
                                }
                                setSelectedProduct(product);
                                setShowCheckout(true);
                            }}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 shadow-xl"
                        >
                            {isLoggedIn ? "Initialize Protocol" : "Acquire Protocol"} <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] italic">No active protocols detected in this frequency range</p>
                </div>
            )}
         </div>
      </div>

      {/* Global Status Footer */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-black border-t border-zinc-900/50 backdrop-blur-xl flex items-center px-10 justify-between z-50">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">API: Stable</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nodes: 147 Online</span>
            </div>
        </div>
        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">Percepta Global Security Network © 2026</span>
      </div>
      {/* Checkout Modal */}
      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><ShoppingCart className="w-48 h-48 text-indigo-500" /></div>
            
            <button onClick={() => setShowCheckout(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
                <ChevronRight className="w-8 h-8 rotate-90" />
            </button>

            <div className="mb-10">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Protocol Procurement</span>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Confirm Acquisition</h2>
            </div>

            <div className="p-6 bg-zinc-900/40 border border-zinc-900 rounded-2xl mb-10 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selected Unit</span>
                    <span className="text-[11px] font-black text-white uppercase italic">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Tax / Cost</span>
                    <span className="text-xl font-black text-white italic">${selectedProduct.price}</span>
                </div>
            </div>

            <div className="space-y-4">
                { (userRole === "admin" || userRole === "reseller") ? (
                  <>
                    <button 
                      onClick={handleProcure}
                      disabled={procuring}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {procuring ? "Synchronizing Matrix..." : "Confirm & Download Protocol"}
                    </button>
                    <p className="text-[8px] font-bold text-zinc-600 text-center uppercase tracking-widest">
                        Neural Reseller Priority: This protocol will be deducted from your available credit balance.
                    </p>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => alert("Redirecting to External Secure Marketplace...")}
                      className="w-full py-5 bg-zinc-100 hover:bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-white/5"
                    >
                      Purchase via External Marketplace
                    </button>
                    <p className="text-[8px] font-bold text-zinc-600 text-center uppercase tracking-widest">
                        Consumer Notice: Direct protocol initialization is restricted to license providers. Please secure your key via the external node.
                    </p>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
