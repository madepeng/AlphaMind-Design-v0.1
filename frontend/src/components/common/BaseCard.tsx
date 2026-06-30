import type { ReactNode } from "react";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

export function BaseCard({ children, className = "" }: BaseCardProps) {
  return (
    <div
      className={`rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
