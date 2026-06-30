import { getMockNewsUrl } from "../../services/companyService";
import type { CompanyNewsDTO } from "../../types/company";
import { BaseCard } from "../common/BaseCard";

interface NewsListProps {
  news: CompanyNewsDTO[];
  ticker: string;
}

export function NewsList({ news, ticker }: NewsListProps) {
  return (
    <div className="space-y-4">
      {news.slice(0, 10).map((item) => (
        <a
          aria-label={item.title}
          className="block"
          href={getMockNewsUrl(ticker, item.title)}
          key={`${item.publishedAt}-${item.title}`}
          rel="noreferrer"
          target="_blank"
        >
          <BaseCard className="hover:brightness-110">
            <h3 className="text-sm font-medium">{item.title}</h3>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              {item.publishedAt} · {item.source}
            </p>
          </BaseCard>
        </a>
      ))}
    </div>
  );
}
