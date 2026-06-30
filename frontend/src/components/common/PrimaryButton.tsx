import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`h-10 rounded-lg bg-[#F9FAFB] px-4 text-sm font-medium text-[#111827] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      type={type}
      {...props}
    />
  );
}
