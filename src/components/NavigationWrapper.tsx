"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#08080A] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
