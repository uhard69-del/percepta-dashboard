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

import { getApiUrl } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_enabled: boolean;
  version: string;
  stock_limit: string;
  auto_generate: boolean;
  is_on_sale: boolean;
  sale_price?: string;
  extra_metadata?: string;
  active_licenses?: number;
  last_log?: string;
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
  const [newProductPrice, setNewProductPrice] = useState("49.99");
  const [newProductVer, setNewProductVer] = useState("1.0.0");
  const [newProductCat, setNewProductCat] = useState("Misc");
  const [newProductStock, setNewProductStock] = useState("10");
  const [newProductAuto, setNewProductAuto] = useState(false);
  const [newProductOnSale, setNewProductOnSale] = useState(false);
  const [newProductSalePrice, setNewProductSalePrice] = useState("");
  const [newProductDownloadUrl, setNewProductDownloadUrl] = useState("");
  const [newProductIsEnabled, setNewProductIsEnabled] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/products/admin/products"), {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
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

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setNewProductName("");
    setNewProductDesc("");
    setNewProductPrice("49.99");
    setNewProductVer("1.0.0");
    setNewProductCat("Misc");
    setNewProductStock("10");
    setNewProductAuto(false);
    setNewProductOnSale(false);
    setNewProductSalePrice("");
    setNewProductDownloadUrl("");
    setNewProductIsEnabled(true);
    setError(null);
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductDesc(product.description || "");
    setNewProductPrice(product.price);
    setNewProductVer(product.version);
    setNewProductCat(product.category);
    setNewProductStock(product.stock_limit);
    setNewProductAuto(product.auto_generate);
    setNewProductOnSale(product.is_on_sale);
    setNewProductSalePrice(product.sale_price || "");
    setNewProductIsEnabled(product.is_enabled);
    
    // Parse metadata for download_url
    try {
      if (product.extra_metadata) {
        const meta = JSON.parse(product.extra_metadata);
        setNewProductDownloadUrl(meta.download_url || "");
      } else {
        setNewProductDownloadUrl("");
      }
    } catch {
      setNewProductDownloadUrl("");
    }
    
    setError(null);
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccess(false);

    const metadataObj: any = {};
    if (newProductDownloadUrl) {
        metadataObj.download_url = newProductDownloadUrl;
    }

    const payload = { 
      name: newProductName, 
      description: newProductDesc,
      price: newProductPrice,
      category: newProductCat,
      version: newProductVer,
      stock_limit: newProductStock,
      auto_generate: newProductAuto,
      is_on_sale: newProductOnSale,
      sale_price: newProductOnSale ? newProductSalePrice : null,
      extra_metadata: JSON.stringify(metadataObj),
      is_enabled: newProductIsEnabled
    };

    try {
      const url = editingProduct 
        ? getApiUrl(`/api/products/admin/products/${editingProduct.id}`)
        : getApiUrl("/api/products/admin/products");
      
      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        fetchProducts();
        setTimeout(() => { setIsModalOpen(false); setSuccess(false); }, 1500);
      } else {
        const data = await res.json();
        setError(data.detail || "Operation failed");
      }
    } catch (err) {
      setError("Network failure. Verify cloud relay status.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefillStock = async (name: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/products/admin/products/${name}/refill?count=10`), {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Refill failed", err);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`DANGER: Are you sure you want to completely delete product [${name}]? This action deletes the template and all associated licenses.`)) return;
    try {
      const res = await fetch(getApiUrl(`/api/products/admin/products/${id}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleGlobalWipe = async () => {
    if (!window.confirm("CRITICAL WARNING: This will permanently delete ALL products and ALL associated licenses from the system. This action cannot be undone. Proceed?")) return;
    try {
      const res = await fetch(getApiUrl("/api/products/admin/products/bulk/wipe"), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("System Cleaned. All products and licenses have been removed.");
        fetchProducts();
      } else {
        alert("Wipe failed.");
      }
    } catch (err) {
      console.error("Wipe error", err);
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
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Product Inventory</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Product Management</h1>
          </div>
          <div className="flex gap-4">
             <button onClick={handleGlobalWipe} className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                Wipe All Products
             </button>
             <button onClick={fetchProducts} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-600 hover:text-white transition-all">
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
             </button>
             <button onClick={handleOpenCreateModal} className="px-8 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl">
                Add New Product
             </button>
          </div>
        </div>

        {loading ? (
           <div className="py-24 text-center">
              <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Loading Products...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-zinc-950/40 border border-zinc-900 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl flex flex-col relative">
                {/* Product Banner Area */}
                <div className="h-32 bg-gradient-to-br from-indigo-900/20 to-zinc-900 relative p-8">
                    <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                            {product.is_enabled ? "Live Store" : "Maintenance Mode"}
                        </span>
                    </div>
                    <div className="absolute -bottom-6 left-8">
                        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-indigo-500/30 transition-all transform group-hover:scale-110">
                            <Shield className="w-6 h-6 text-indigo-500" />
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-10 flex-1 flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[7px] font-black text-indigo-500 uppercase tracking-widest">{product.category}</span>
                             <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[7px] font-black text-zinc-600 uppercase tracking-widest">v{product.version}</span>
                        </div>
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
                             {product.auto_generate && (
                                <>
                                    <span className="text-[9px] font-black text-zinc-800 uppercase">|</span>
                                    <span className="text-[9px] font-black text-orange-500 uppercase italic">Auto-Gen Enabled</span>
                                </>
                             )}
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed mb-6">
                        {product.description || "Core security module protecting application memory."}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-auto">
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Price</p>
                             <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-indigo-500" />
                                <span className="text-sm font-black text-white italic">{product.price}</span>
                             </div>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Active Licenses</p>
                             <p className="text-sm font-black text-emerald-500 italic">{product.active_licenses ?? 0}</p>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Last Log</p>
                             <p className="text-[9px] font-mono font-bold text-zinc-500 truncate">{product.last_log ? new Date(product.last_log).toLocaleDateString() : "None"}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Stock Availability</span>
                             <span className="text-xs font-black text-white italic">{product.stock_limit} units</span>
                          </div>
                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleRefillStock(product.name)}
                                className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-indigo-500 hover:border-indigo-500/30 transition-all group/refill"
                                title="Add Licenses"
                             >
                                <RefreshCw className="w-4 h-4 group-hover/refill:rotate-180 transition-transform duration-500" />
                             </button>
                             <button 
                                onClick={() => handleEditProduct(product)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black text-zinc-500 hover:text-white uppercase italic tracking-widest transition-all"
                             >
                                Edit Product <ChevronRight className="w-3 h-3" />
                             </button>
                             <button 
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all group/del"
                                title="Delete Product"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                    </div>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="lg:col-span-3 py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                 <Package className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                  <h3 className="text-xl font-black text-zinc-700 uppercase italic tracking-widest mb-2">No Products Found</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Click 'Add New Product' to clear the slate</p>
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
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">
                {editingProduct ? "Update product details and pricing" : "Create a new product listing for your store"}
              </p>
            </div>

            {success ? (
               <div className="py-12 text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-widest">
                    {editingProduct ? "Product Updated" : "Product Created"}
                  </h3>
               </div>
            ) : (
              <form onSubmit={handleSaveProduct} className="space-y-6">
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

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Category</label>
                        <select value={newProductCat} onChange={(e) => setNewProductCat(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white uppercase tracking-widest focus:border-indigo-500/50 outline-none transition-all appearance-none cursor-pointer">
                            <option value="Aimbot">Aimbot</option>
                            <option value="ESP">ESP</option>
                            <option value="Misc">Misc</option>
                            <option value="Bundles">Bundles</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Stock Limit</label>
                        <input type="text" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white uppercase tracking-widest focus:border-indigo-500/50 outline-none transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">On Sale</span>
                            <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">Trigger Discount</span>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setNewProductOnSale(!newProductOnSale)}
                            className={cn(
                                "w-10 h-5 rounded-full transition-all relative",
                                newProductOnSale ? "bg-indigo-600" : "bg-zinc-800"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                newProductOnSale ? "right-1" : "left-1"
                            )} />
                        </button>
                    </div>
                    {newProductOnSale && (
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Sale Price (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                <input type="text" value={newProductSalePrice} onChange={(e) => setNewProductSalePrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-14 py-4 text-xs font-bold text-emerald-500 uppercase tracking-widest focus:border-emerald-500/50 outline-none transition-all" placeholder="0.00" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">External Download URL (Direct .exe link)</label>
                    <div className="relative">
                        <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input type="text" value={newProductDownloadUrl} onChange={(e) => setNewProductDownloadUrl(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-14 py-4 text-xs font-bold text-white tracking-wider focus:border-indigo-500/50 outline-none transition-all" placeholder="https://external-host.com/binary.exe" />
                    </div>
                    <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest ml-2 italic">* Dashboard will proxy this stream to keep the origin secure</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Product Visible</span>
                        <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">Toggle maintenance mode</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setNewProductIsEnabled(!newProductIsEnabled)}
                        className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            newProductIsEnabled ? "bg-emerald-600" : "bg-zinc-800"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            newProductIsEnabled ? "right-1" : "left-1"
                        )} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Auto-Generate</span>
                        <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">Create keys on-demand</span>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setNewProductAuto(!newProductAuto)}
                        className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            newProductAuto ? "bg-indigo-600" : "bg-zinc-800"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            newProductAuto ? "right-1" : "left-1"
                        )} />
                    </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Description</label>
                  <textarea value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-4 text-xs font-bold text-white min-h-[100px] resize-none focus:border-indigo-500/50 outline-none transition-all" />
                </div>

                <button disabled={isCreating} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-widest italic text-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] disabled:opacity-50">
                  {isCreating ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
