import { SecondaryButton } from "../../components/common/SecondaryButton";
import { Input } from "../../components/forms/Input";

interface JournalToolbarProps {
  onSearch: (query: string) => void;
  query: string;
}

export function JournalToolbar({
  onSearch,
  query,
}: JournalToolbarProps) {
  return (
    <section aria-label="Journal toolbar" className="mt-8 flex gap-3">
      <Input
        aria-label="Search Journal"
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search ticker or date"
        type="search"
        value={query}
      />
      <SecondaryButton disabled title="Coming Soon">
        Sort · Coming Soon
      </SecondaryButton>
      <SecondaryButton disabled title="Coming Soon">
        Refresh · Coming Soon
      </SecondaryButton>
    </section>
  );
}
