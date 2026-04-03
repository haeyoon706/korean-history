import Link from "next/link";
import type { Era } from "@/data/timeline";
import { getContentByPeriod, type SortKey } from "@/lib/content";
import { ContentCard } from "@/components/content/ContentCard";

const ERA_COLOR_MAP: Record<string, string> = {
  gojoseon: "bg-era-gojoseon",
  samguk: "bg-era-samguk",
  "unified-silla": "bg-era-unified",
  goryeo: "bg-era-goryeo",
  joseon: "bg-era-joseon",
  empire: "bg-era-empire",
  japanese: "bg-era-japanese",
  modern: "bg-era-modern",
};

function formatYear(year: number): string {
  if (year < 0) return `BC ${Math.abs(year)}`;
  return `${year}`;
}

export function TimelineEraSection({
  era,
  sort = "timeline",
}: {
  era: Era;
  sort?: SortKey;
}) {
  const colorClass = ERA_COLOR_MAP[era.id] ?? "bg-muted";

  return (
    <li className="relative pl-10 pb-12 md:pl-14">
      {/* Timeline dot */}
      <div
        className={`absolute left-3 top-1 h-4 w-4 rounded-full border-2 border-background ${colorClass} md:left-6`}
      />

      {/* Era header */}
      <div className="mb-4">
        <Link
          href={`/era/${era.id}`}
          className="group inline-flex items-baseline gap-2"
        >
          <h2 className="text-xl font-bold group-hover:underline">
            {era.name}
          </h2>
          <span className="text-sm text-muted">
            {formatYear(era.startYear)} ~ {formatYear(era.endYear)}
          </span>
        </Link>
      </div>

      {/* Periods */}
      <div className="space-y-8">
        {era.periods
          .filter(
            (p) => p.id !== `${era.id}-general` && p.id !== "joseon-general"
          )
          .map((period) => {
            const items = getContentByPeriod(period.id, sort);
            if (items.length === 0) return null;

            const preview = items.slice(0, 3);
            const remaining = items.length - preview.length;

            return (
              <div key={period.id}>
                <Link
                  href={`/era/${era.id}/${period.id}`}
                  className="group mb-3 inline-flex items-baseline gap-2"
                >
                  <h3 className="text-base font-semibold group-hover:underline">
                    {period.name}
                  </h3>
                  <span className="text-xs text-muted">
                    {formatYear(period.startYear)} ~{" "}
                    {formatYear(period.endYear)}
                  </span>
                  <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted">
                    {items.length}편
                  </span>
                </Link>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {preview.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>

                {remaining > 0 && (
                  <Link
                    href={`/era/${era.id}/${period.id}`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    +{remaining}편 더 보기
                  </Link>
                )}
              </div>
            );
          })}

        {/* joseon-general 항목 (시기 미상) */}
        {era.id === "joseon" &&
          (() => {
            const generalItems = getContentByPeriod("joseon-general", sort);
            if (generalItems.length === 0) return null;
            const preview = generalItems.slice(0, 3);
            const remaining = generalItems.length - preview.length;
            return (
              <div>
                <Link
                  href={`/era/joseon/joseon-general`}
                  className="group mb-3 inline-flex items-baseline gap-2"
                >
                  <h3 className="text-base font-semibold group-hover:underline">
                    시기 미상
                  </h3>
                  <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted">
                    {generalItems.length}편
                  </span>
                </Link>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {preview.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
                {remaining > 0 && (
                  <Link
                    href={`/era/joseon/joseon-general`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    +{remaining}편 더 보기
                  </Link>
                )}
              </div>
            );
          })()}
      </div>
    </li>
  );
}
