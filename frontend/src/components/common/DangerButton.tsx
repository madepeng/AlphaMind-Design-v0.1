import type { ButtonHTMLAttributes } from "react";

type DangerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function DangerButton({
  className = "",
  type = "button",
  ...props
}: DangerButtonProps) {
  return (
    <button
      className={`h-10 rounded-lg border border-[#EF4444] px-4 text-sm font-medium text-[#EF4444] opacity-0 transition-opacity duration-200 hover:bg-[#EF4444] hover:text-[#F9FAFB] focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF4444] group-hover:opacity-100 ${className}`}
      type={type}
      {...props}
    />
  );
}
