"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { 
  Plus, 
  Package, 
  Settings, 
  Box, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Shield,
  ExternalLink,
  Zap,
  RefreshCw,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

// Robust API helper
const getApiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  if (normalizedBase.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${normalizedBase}${normalizedPath.substring(4)}`;
  }
  return `${normalizedBase}${normalizedPath}`;
};

interface Product {
  id: string;
  name: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [newProductName, setNewProductName] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    setIsCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(getApiUrl("/api/products/admin/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProductName, description: newProductDesc }),
      });

      if (res.ok) {
        setSuccess(true);
        setNewProductName("");
        setNewProductDesc("");
        fetchProducts();
        setTimeout(() => { setIsModalOpen(false); setSuccess(false); }, 1500);
      } else {
        const data = await res.json();
        setError(data.detail || "Module initialization failed");
      }
    } catch (err) {
      setError("Network failure. Verify backend node status.");
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
            <h1 className="text-[40px] font-black text-white tracking-tighter uppercase italic leading-none mb-3">
              Module Definitions
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Configure secure application targets and Stage-3 targets
            </p>
          </div>
          
          <div className="flex gap-4">
             <button 
               onClick={fetchProducts}
               className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-600 hover:text-white transition-all"
             >
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button 
               onClick={() => { setError(null); setSuccess(false); setIsModalOpen(true); }}
               className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] group uppercase italic tracking-widest text-sm"
             >
               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
               Establish Module
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* System Health Status */}
           <div className="lg:col-span-4 bg-zinc-950/30 border border-zinc-900 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stage-1: Backend API [ONLINE]</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", products.length > 0 ? "bg-emerald-500" : "bg-amber-500")} />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stage-2: Dashboard Sync [{products.length > 0 ? "ACTIVE" : "PENDING"}]</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stage-3: Client Socket [READY]</span>
                 </div>
              </div>
              <p className="text-[9px] font-black text-indigo-500 uppercase italic tracking-widest">Matrix Status: Synchronized</p>
           </div>
        </div>

        {loading ? (
           <div className="py-24 text-center">
              <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Decrypting module manifest...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all group flex flex-col shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <Box className="w-24 h-24 text-indigo-500 -mr-8 -mt-8 rotate-12" />
                </div>

                <div className="flex items-start justify-between mb-8">
                  <div className="p-5 rounded-3xl bg-zinc-900/50 border border-zinc-900 group-hover:border-indigo-500/20 transition-all">
                    <Package className="w-8 h-8 text-indigo-500" />
                  </div>
                  <button 
                    onClick={() => { setSelectedProduct(product); setShowConnectModal(true); }}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-indigo-500 hover:border-indigo-500/30 transition-all"
                  >
                     <Zap className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-8 flex-1 relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed mb-4">
                    {product.description || "Core security module protecting application runtime memory."}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl">
                     <Terminal className="w-3 h-3 text-indigo-500" />
                     <code className="text-[9px] font-bold text-zinc-400 font-mono tracking-widest truncate">{product.id}</code>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-zinc-900 mt-auto relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Protection</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase italic tracking-widest underline decoration-wavy decoration-emerald-500/30">Level 5</span>
                   </div>
                   <button 
                    onClick={() => { setSelectedProduct(product); setShowConnectModal(true); }}
                    className="flex items-center gap-2 text-[10px] font-black text-white uppercase italic tracking-widest hover:text-indigo-500 transition-colors"
                   >
                      Integrate <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="lg:col-span-3 py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                 <Shield className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                 <h3 className="text-xl font-black text-zinc-700 uppercase italic tracking-widest mb-2">Registry Empty</h3>
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">No security modules defined for this environment</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Integration Modal */}
      {showConnectModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-2xl rounded-[2.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Shield className="w-64 h-64 text-indigo-500 -mr-20 -mt-20" />
             </div>
             
             <button onClick={() => setShowConnectModal(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors z-10">
               <Plus className="w-8 h-8 rotate-45" />
             </button>

             <div className="mb-10 relative z-10">
               <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Connect: {selectedProduct.name}</h2>
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Full system integration guide for module stage-3</p>
             </div>

             <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-black">1</div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Define</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Ensure product "{selectedProduct.name}" is created in the dashboard.</p>
                      <div className="flex items-center gap-2 text-emerald-500"><CheckCircle2 className="w-3 h-3" /><span className="text-[8px] font-black uppercase">Verified</span></div>
                   </div>
                   <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-black">2</div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Link Client</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Update Client's `API_URL` and set Product to `{selectedProduct.name}`.</p>
                      <div className="flex items-center gap-2 text-indigo-500 animate-pulse"><Zap className="w-3 h-3" /><span className="text-[8px] font-black uppercase">Socket Ready</span></div>
                   </div>
                   <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 text-xs font-black">3</div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Generate</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">Generate a key for this product in the 'Generated Keys' tab.</p>
                   </div>
                </div>

                <div className="p-8 bg-zinc-900/30 border border-zinc-900 rounded-3xl space-y-4">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">C# Connection Constant</h4>
                   <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                      <code className="text-xs font-bold font-mono text-white tracking-widest">private const string PRODUCT_NAME = "{selectedProduct.name}";</code>
                      <button onClick={() => navigator.clipboard.writeText(selectedProduct.name)} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-white transition-colors">Copy</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Create Module Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6">
          <div className="bg-[#0A0A0C] border border-zinc-900 w-full max-w-lg rounded-[2.5rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
              <Plus className="w-8 h-8 rotate-45" />
            </button>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">New Module</h2>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Initialize a new secure application target</p>
            </div>

            {success ? (
              <div className="py-12 text-center">
                 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Module Established</h3>
              </div>
            ) : (
              <form onSubmit={handleCreateProduct} className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Module Name</label>
                  <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-5 text-xs font-bold text-white uppercase tracking-widest" placeholder="E.G. AIMBOT_STABLE" required />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.4em] ml-2">Core Description</label>
                  <textarea value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-5 text-xs font-bold text-white min-h-[120px] resize-none" placeholder="OPTIONAL ENCRYPTED TAGS..." />
                </div>
                <button disabled={isCreating} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-widest italic text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)]">
                  {isCreating ? "Initializing..." : "Register Module"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
