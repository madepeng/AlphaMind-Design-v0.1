interface ToastProps {
  message: string;
  tone?: "error" | "notice";
}

export function Toast({ message, tone = "notice" }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-[384px] z-50 rounded-lg border bg-[#1F2937] px-4 py-3 text-sm shadow-lg ${
        tone === "error"
          ? "border-[#EF4444] text-[#F9FAFB]"
          : "border-[#F59E0B] text-[#F59E0B]"
      }`}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </div>
  );
}
