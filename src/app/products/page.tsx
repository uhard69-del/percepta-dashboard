"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Plus, 
  Package, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Shield,
  Zap,
  RefreshCw,
  Terminal,
  MoreVertical,
  ChevronRight,
  DollarSign,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  is_enabled: boolean;
  version: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [newProductName, setNewProductName] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("0.00");
  const [newProductVer, setNewProductVer] = useState("1.0.0");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/products/admin/products"));
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(getApiUrl("/api/products/admin/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newProductName, 
          description: newProductDesc,
          price: newProductPrice,
          version: newProductVer,
          is_enabled: true
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setNewProductName("");
        setNewProductDesc("");
        fetchProducts();
        setTimeout(() => { setIsModalOpen(false); setSuccess(false); }, 1500);
      } else {
        const data = await res.json();
        setError(data.detail || "Unit initialization failed");
      }
    } catch (err) {
      setError("Network failure. Verify cloud relay status.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      <div className="p-10 max-w-[1600px] mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Inventory Control</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Product Hub</h1>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchProducts} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-600 hover:text-white transition-all">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl">
                Register New Unit
             </button>
          </div>
        </div>

        {loading ? (
           <div className="py-24 text-center">
              <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Accessing Secure Vault...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl flex flex-col relative">
                {/* Product Banner Area */}
                <div className="h-32 bg-gradient-to-br from-indigo-900/20 to-zinc-900 relative p-8">
                    <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                            Live Preview
                        </span>
                        <div className="p-2 bg-zinc-950/50 rounded-xl">
                            <MoreVertical className="w-4 h-4 text-zinc-600" />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 left-8">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-indigo-500/30 transition-all transform group-hover:scale-110">
                            <Shield className="w-6 h-6 text-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-10 flex-1 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1.5">
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    product.is_enabled ? "bg-emerald-500" : "bg-red-500"
                                )} />
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                                    {product.is_enabled ? "Active" : "Disabled"}
                                </span>
                             </div>
                             <span className="text-[9px] font-black text-zinc-800 uppercase">|</span>
                             <span className="text-[9px] font-black text-indigo-500 uppercase italic">v{product.version}</span>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed mb-6">
                        {product.description || "Core security module protecting application memory."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Price Tag</p>
                             <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-indigo-500" />
                                <span className="text-sm font-black text-white italic">{product.price}</span>
                             </div>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Unit ID</p>
                             <p className="text-[10px] font-mono font-bold text-zinc-500 truncate">{product.id.split('-')[0]}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center justify-between">
                         <span className="text-[9px] font-black text-zinc-800 uppercase tracking-tighter">Last key issue: 3m ago</span>
                         <button className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase italic tracking-widest transition-colors">
                            Manage <ChevronRight className="w-3 h-3" />
                         </button>
                    </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="lg:col-span-3 py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                 <Package className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                 <h3 className="text-xl font-black text-zinc-700 uppercase italic tracking-widest mb-2">Inventory Empty</h3>
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">No security products defined</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[2.5rem] p-12 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
              <Plus className="w-8 h-8 rotate-45" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Initialize Unit</h2>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Configure a new commercial product target</p>
            </div>

            {success ? (
              <div className="py-12 text-center animate-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Relay Created</h3>
              </div>
            ) : (
              <form onSubmit={handleCreateProduct} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Name</label>
                        <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white uppercase tracking-widest focus:border-indigo-500/50 outline-none transition-all" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Version</label>
                        <input type="text" value={newProductVer} onChange={(e) => setNewProductVer(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white uppercase tracking-widest focus:border-indigo-500/50 outline-none transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Price (USD)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input type="text" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-14 py-4 text-xs font-bold text-indigo-500 uppercase tracking-widest focus:border-indigo-500/50 outline-none transition-all" required />
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Description</label>
                  <textarea value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white min-h-[100px] resize-none focus:border-indigo-500/50 outline-none transition-all" />
                </div>

                <button disabled={isCreating} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-widest italic text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] disabled:opacity-50">
                  {isCreating ? "Initializing..." : "Establish Relay"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
