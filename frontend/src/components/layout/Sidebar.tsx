const disabledItems = ["Watchlist", "Journal", "Settings"];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-[#374151] bg-[#111827] p-6">
      <p className="text-sm font-semibold tracking-wide text-[#F9FAFB]">
        AlphaMind OS
      </p>
      <nav aria-label="Primary" className="mt-8 space-y-2">
        <button
          aria-current="page"
          className="flex h-10 w-full items-center rounded-lg bg-[#1F2937] px-3 text-left text-sm font-medium text-[#F9FAFB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB]"
          type="button"
        >
          Home
        </button>
        {disabledItems.map((item) => (
          <button
            className="flex h-10 w-full cursor-not-allowed items-center rounded-lg px-3 text-left text-sm text-[#9CA3AF] opacity-50"
            disabled
            key={item}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
