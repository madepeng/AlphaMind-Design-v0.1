import { NavLink } from "react-router-dom";

const enabledItems = [
  { label: "Home", to: "/" },
  { label: "Watchlist", to: "/watchlist" },
];

const disabledItems = ["Journal", "Settings"];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-[#374151] bg-[#111827] p-6">
      <p className="text-sm font-semibold tracking-wide text-[#F9FAFB]">
        AlphaMind OS
      </p>
      <nav aria-label="Primary" className="mt-8 space-y-2">
        {enabledItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex h-10 w-full items-center rounded-lg px-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB] ${
                isActive
                  ? "bg-[#1F2937] font-medium text-[#F9FAFB]"
                  : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB]"
              }`
            }
            end={item.to === "/"}
            key={item.to}
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
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
