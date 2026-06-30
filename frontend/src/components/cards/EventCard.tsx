import type { HomeEventDTO } from "../../types/home";
import { BaseCard } from "../common/BaseCard";

interface EventCardProps {
  event: HomeEventDTO;
  onSelect: () => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <button
      className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9FAFB]"
      onClick={onSelect}
      type="button"
    >
      <BaseCard>
        <h3 className="text-sm font-medium text-[#F9FAFB]">{event.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
          {event.summary}
        </p>
      </BaseCard>
    </button>
  );
}
