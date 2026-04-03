import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { TIMELINE, findPeriodById, findEraByPeriodId } from "@/data/timeline";
import { getContentByPeriod } from "@/lib/content";
import { ContentGrid } from "@/components/content/ContentGrid";

export function generateStaticParams() {
  return TIMELINE.flatMap((era) =>
    era.periods.map((p) => ({ eraId: era.id, periodId: p.id }))
  );
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ eraId: string; periodId: string }>;
}): Promise<Metadata> {
  return params.then(({ periodId }) => {
    const result = findPeriodById(periodId);
    if (!result) return { title: "Not Found" };
    const count = getContentByPeriod(periodId).length;
    return {
      title: `${result.period.name} — ${result.era.name} — 한국사 타임라인`,
      description: `${result.era.name} ${result.period.name} 시기의 영화·드라마 ${count}편을 탐색하세요.`,
    };
  });
}

function formatYear(year: number): string {
  if (year < 0) return `BC ${Math.abs(year)}`;
  return `${year}`;
}

export default async function PeriodPage({
  params,
}: {
  params: Promise<{ eraId: string; periodId: string }>;
}) {
  const { eraId, periodId } = await params;
  const era = findEraByPeriodId(periodId);
  const result = findPeriodById(periodId);

  if (!era || !result || era.id !== eraId) notFound();

  const { period } = result;
  const items = getContentByPeriod(periodId);
  const movieCount = items.filter((i) => i.type === "movie").length;
  const dramaCount = items.filter((i) => i.type === "drama").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">
          전체
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/era/${era.id}`} className="hover:underline">
          {era.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{period.name}</span>
      </nav>

      <h1 className="text-3xl font-bold">{period.name}</h1>
      <p className="mt-1 text-muted">
        {formatYear(period.startYear)} ~ {formatYear(period.endYear)} · 영화{" "}
        {movieCount}편 · 드라마 {dramaCount}편
      </p>

      <div className="mt-8">
        <ContentGrid items={items} />
      </div>
    </div>
  );
}
