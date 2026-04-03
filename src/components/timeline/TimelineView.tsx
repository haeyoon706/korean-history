import { TIMELINE } from "@/data/timeline";
import { TimelineEraSection } from "./TimelineEraSection";
import type { SortKey } from "@/lib/content";

export function TimelineView({ sort = "timeline" }: { sort?: SortKey }) {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="timeline-line bg-border" />

      <ol className="relative">
        {TIMELINE.map((era) => (
          <TimelineEraSection key={era.id} era={era} sort={sort} />
        ))}
      </ol>
    </div>
  );
}
