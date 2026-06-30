import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className = "", ...props }: TextAreaProps) {
  return (
    <textarea
      className={`min-h-24 w-full resize-none rounded-lg border border-[#374151] bg-[#111827] p-3 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#F9FAFB] focus:outline-none ${className}`}
      {...props}
    />
  );
}
