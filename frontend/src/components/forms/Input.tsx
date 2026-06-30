import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`h-10 w-full rounded-lg border border-[#374151] bg-[#1F2937] px-3 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#F9FAFB] focus:outline-none ${className}`}
      {...props}
    />
  );
}
