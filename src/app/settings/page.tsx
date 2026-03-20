"use client";

import { Header } from "@/components/Header";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Globe,
  Bell,
  Cpu,
  CheckCircle2,
  Save,
  Palette,
  Key,
  Hash,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  QrCode,
  Mail,
  Lock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  // General Settings
  const [companyName, setCompanyName] = useState("PerceptaAI");
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [darkColor, setDarkColor] = useState("#08080A");
  const [lightColor, setLightColor] = useState("#f7f7f7");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [chartCurve, setChartCurve] = useState("linear");
  const [autoGenKeys, setAutoGenKeys] = useState(false);
  const [licenseUrlRoute, setLicenseUrlRoute] = useState("/api/license");
  const [clientEmailDomain, setClientEmailDomain] = useState("");

  // Defaults
  const [realtimeLimit, setRealtimeLimit] = useState(50);
  const [defaultMaxIps, setDefaultMaxIps] = useState(5);
  const [defaultMaxHwids, setDefaultMaxHwids] = useState(1);
  const [keyFormat, setKeyFormat] = useState("XXXX-XXXX-XXXX-XXXX");

  // API
  const [apiKey] = useState("pai_sk_a7b3c9d1e5f2g8h4");
  const [showApiKey, setShowApiKey] = useState(false);

  // Account
  const [email, setEmail] = useState("admin@perceptaai.com");
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState("");

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "defaults" | "api" | "account">("general");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 800);
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: Palette },
    { id: "defaults" as const, label: "Defaults", icon: SettingsIcon },
    { id: "api" as const, label: "API", icon: Key },
    { id: "account" as const, label: "Account", icon: User },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#08080A]">
      <Header />
      
      <div className="p-10 max-w-[1200px] mx-auto space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Configuration</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              Settings
            </h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(139,92,246,0.3)] uppercase italic tracking-widest text-[10px] disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Syncing..." : showSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-zinc-950/50 p-2 rounded-2xl border border-zinc-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings Tab */}
        {activeTab === "general" && (
          <div className="space-y-8">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-8">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Palette className="w-4 h-4 text-primary" />
                General Settings
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest -mt-4">Here you can change the settings for your panel.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Company Name</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The name of your company</p>
                  <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Logo URL</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The URL of your logo</p>
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Primary Colour</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The primary colour of your theme</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-zinc-800 cursor-pointer bg-transparent" />
                    <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Base Dark Colour</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The base dark colour of your theme</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-zinc-800 cursor-pointer bg-transparent" />
                    <input value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Base Light Colour</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The base light colour of your theme</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-zinc-800 cursor-pointer bg-transparent" />
                    <input value={lightColor} onChange={(e) => setLightColor(e.target.value)}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Line Chart Curve</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The curve type of the line chart</p>
                  <select value={chartCurve} onChange={(e) => setChartCurve(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none appearance-none cursor-pointer">
                    <option value="linear">Linear</option>
                    <option value="smooth">Smooth</option>
                    <option value="step">Step</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Currency Symbol</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The currency symbol of your panel</p>
                  <input value={currencySymbol} onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Auto-Generate License Keys</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">Automatically generate keys for new licenses</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setAutoGenKeys(true)}
                      className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        autoGenKeys ? "bg-primary text-white" : "bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:text-white")}>
                      Enabled
                    </button>
                    <button onClick={() => setAutoGenKeys(false)}
                      className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        !autoGenKeys ? "bg-primary text-white" : "bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:text-white")}>
                      Disabled
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">License URL Route</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The API route used for checking licenses</p>
                  <input value={licenseUrlRoute} onChange={(e) => setLicenseUrlRoute(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Client Email Domain</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The email domain for client login emails</p>
                  <input value={clientEmailDomain} onChange={(e) => setClientEmailDomain(e.target.value)} placeholder="perceptaai.com"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 focus:border-primary/50 transition-all outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Defaults Tab */}
        {activeTab === "defaults" && (
          <div className="space-y-8">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-8">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <SettingsIcon className="w-4 h-4 text-primary" />
                Default Settings
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest -mt-4">Here you can change the default settings for your panel.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Realtime Default Limit</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The default limit of logs shown in realtime view</p>
                  <input type="number" value={realtimeLimit} onChange={(e) => setRealtimeLimit(Number(e.target.value))}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Default Max IPs</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The default limit of IPs in new licenses</p>
                  <input type="number" value={defaultMaxIps} onChange={(e) => setDefaultMaxIps(Number(e.target.value))}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Default Max HWIDs</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The default limit of hardware IDs in new licenses</p>
                  <input type="number" value={defaultMaxHwids} onChange={(e) => setDefaultMaxHwids(Number(e.target.value))}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Generate License Key Format</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The format of randomly generated license keys</p>
                  <select value={keyFormat} onChange={(e) => setKeyFormat(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none appearance-none cursor-pointer">
                    <option value="XXXX-XXXX-XXXX-XXXX">XXXX-XXXX-XXXX-XXXX</option>
                    <option value="XXXXXXXX-XXXX">XXXXXXXX-XXXX</option>
                    <option value="PAI-XXXX-XXXX-XXXX">PAI-XXXX-XXXX-XXXX</option>
                    <option value="UUID">UUID Format</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cloud Node Status */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Cpu className="w-4 h-4 text-emerald-500" />
                Cloud Node Status
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Backend API (Render)", status: "Active", node: "iad1-02" },
                  { label: "PostgreSQL (Neon)", status: "Connected", node: "us-east-1" },
                  { label: "Dashboard (Vercel)", status: "Optimized", node: "Edge" }
                ].map((node) => (
                  <div key={node.label} className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl">
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{node.label}</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest leading-none">{node.node}</p>
                    </div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase italic bg-emerald-500/10 px-3 py-1 rounded-lg">
                      {node.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div className="space-y-8">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-8">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Key className="w-4 h-4 text-primary" />
                API Configuration
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest -mt-4">Here you can manage your API configuration.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">API Key</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">Your API key for external integrations</p>
                  <div className="relative">
                    <input type={showApiKey ? "text" : "password"} value={apiKey} readOnly
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-xs font-bold text-white outline-none font-mono" />
                    <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all">
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all">
                Update API Key
              </button>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-8">
            {/* 2FA Section */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <QrCode className="w-4 h-4 text-emerald-500" />
                Google Authenticator Setup
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest -mt-2">Enable Two-Factor Authentication (2FA) for added security. This requires a code from Google Authenticator each time you log in.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                  <div className="text-center space-y-3">
                    <QrCode className="w-24 h-24 text-zinc-700 mx-auto" />
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Scan the QR Code</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Enter 2FA Code</label>
                    <input type="text" value={twoFaCode} onChange={(e) => setTwoFaCode(e.target.value)} placeholder="000000"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-zinc-700 focus:border-primary/50 transition-all outline-none font-mono tracking-[0.5em] text-center text-lg" />
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">
                    Verify 2FA Code
                  </button>
                </div>
              </div>
            </div>

            {/* Update Email & Username */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                Update Email & Username
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Change Email Address</label>
                    <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">Update your email to receive notifications and manage account recovery.</p>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">
                    Update Email
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Change Username</label>
                    <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">Select a unique username for your account.</p>
                    <input type="text" value={currentUsername} onChange={(e) => setCurrentUsername(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-primary/50 transition-all outline-none" />
                  </div>
                  <button className="w-full py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all">
                    Update Username
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                <Lock className="w-4 h-4 text-primary" />
                Account Settings
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest -mt-2">Here you can change the password for your account.</p>

              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                  <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-wider">The new password for your account</p>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-xs font-bold text-white placeholder:text-zinc-700 focus:border-primary/50 transition-all outline-none" />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all">
                  Update Password
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-zinc-950/50 border border-red-500/20 rounded-[2rem] p-8 space-y-4">
              <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Deleting your account is permanent. All data will be lost. Proceed with caution.</p>
              
              {!showDeleteConfirm ? (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-4 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all">
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Are you absolutely sure? This cannot be undone.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all">Cancel</button>
                    <button className="flex-1 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all">Confirm Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
