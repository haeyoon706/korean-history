import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { TIMELINE, findEraById } from "@/data/timeline";
import { getContentByPeriod, getContentByEra, parseSortKey } from "@/lib/content";
import { ContentGrid } from "@/components/content/ContentGrid";
import { SortSelect } from "@/components/filter/SortSelect";

export function generateStaticParams() {
  return TIMELINE.map((era) => ({ eraId: era.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ eraId: string }>;
}): Promise<Metadata> {
  return params.then(({ eraId }) => {
    const era = findEraById(eraId);
    if (!era) return { title: "Not Found" };
    const count = getContentByEra(eraId).length;
    return {
      title: `${era.name} — 한국사 타임라인`,
      description: `${era.name} 시대의 영화·드라마 ${count}편을 탐색하세요.`,
    };
  });
}

function formatYear(year: number): string {
  if (year < 0) return `BC ${Math.abs(year)}`;
  return `${year}`;
}

export default async function EraPage({
  params,
  searchParams,
}: {
  params: Promise<{ eraId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { eraId } = await params;
  const sp = await searchParams;
  const era = findEraById(eraId);
  if (!era) notFound();

  const sort = parseSortKey(sp.sort as string | undefined);
  const totalItems = getContentByEra(eraId, sort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:underline">
          전체
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{era.name}</span>
      </nav>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{era.name}</h1>
          <p className="mt-1 text-muted">
            {formatYear(era.startYear)} ~ {formatYear(era.endYear)} · 총{" "}
            {totalItems.length}편
          </p>
        </div>
        <Suspense>
          <SortSelect current={sort} />
        </Suspense>
      </div>

      <div className="mt-8 space-y-12">
        {era.periods.map((period) => {
          const items = getContentByPeriod(period.id, sort);
          if (items.length === 0) return null;

          return (
            <section key={period.id}>
              <Link
                href={`/era/${era.id}/${period.id}`}
                className="group mb-4 inline-flex items-baseline gap-2"
              >
                <h2 className="text-xl font-semibold group-hover:underline">
                  {period.name}
                </h2>
                <span className="text-sm text-muted">
                  {formatYear(period.startYear)} ~{" "}
                  {formatYear(period.endYear)}
                </span>
                <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted">
                  {items.length}편
                </span>
              </Link>
              <ContentGrid items={items} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
