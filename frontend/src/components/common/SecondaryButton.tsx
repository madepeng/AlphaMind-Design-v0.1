import type { ButtonHTMLAttributes } from "react";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({
  className = "",
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={`h-10 rounded-lg border border-[#374151] bg-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type={type}
      {...props}
    />
  );
}
