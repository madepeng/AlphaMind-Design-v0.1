import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`h-10 w-full rounded-lg border border-[#374151] bg-[#111827] px-3 text-sm text-[#F9FAFB] focus:border-[#F9FAFB] focus:outline-none ${className}`}
      {...props}
    />
  );
}
