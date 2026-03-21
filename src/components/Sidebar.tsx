"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Key, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ShieldCheck,
  Activity,
  Terminal,
  Globe,
  Code,
  UserPlus
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generated Keys", href: "/licenses", icon: Key },
  { name: "Product Hub", href: "/products", icon: Package },
  { name: "Realtime", href: "/logs", icon: Activity },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reseller Panel", href: "/resellers", icon: UserPlus },
  { name: "Application", href: "/application", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "API", href: "/api-docs", icon: Code },
  { name: "Integrate", href: "/integrate", icon: Terminal },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredNavigation = navigation.filter(item => {
    if (userRole !== "admin") {
      const adminOnly = ["/products", "/logs", "/application", "/settings", "/resellers", "/api-docs", "/integrate"];
      if (adminOnly.includes(item.href)) return false;
    }
    return true;
  });

  return (
    <div className="flex h-full w-72 flex-col bg-[#0A0A0C] border-r border-zinc-900/50">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-2xl">
            <img src="/logo.png" alt="PerceptaAI" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            Percepta<span className="text-primary italic">AI</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-6 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(139,92,246,0.05)] border border-primary/20" 
                  : "text-zinc-500 hover:bg-zinc-900/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-primary" : "text-zinc-600 group-hover:text-primary"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-zinc-900/50">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}
