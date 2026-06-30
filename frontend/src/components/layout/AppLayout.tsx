import type { ReactNode } from "react";

import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  rightPanel: ReactNode;
}

export function AppLayout({ children, rightPanel }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen min-w-[1280px] bg-[#111827] text-[#F9FAFB]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-8">{children}</main>
      <aside className="w-[360px] shrink-0 border-l border-[#374151] bg-[#111827] p-6">
        {rightPanel}
      </aside>
    </div>
  );
}
