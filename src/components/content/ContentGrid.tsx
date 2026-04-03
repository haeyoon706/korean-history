import type { Content } from "@/types/content";
import { ContentCard } from "./ContentCard";

export function ContentGrid({ items }: { items: Content[] }) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">
        해당하는 콘텐츠가 없습니다.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
