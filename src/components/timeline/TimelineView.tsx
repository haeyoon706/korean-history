import { TIMELINE } from "@/data/timeline";
import { TimelineEraSection } from "./TimelineEraSection";

export function TimelineView() {
  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="timeline-line bg-border" />

      <ol className="relative">
        {TIMELINE.map((era) => (
          <TimelineEraSection key={era.id} era={era} />
        ))}
      </ol>
    </div>
  );
}
