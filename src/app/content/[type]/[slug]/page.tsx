import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllContent, getContentBySlug, getContentByPeriod } from "@/lib/content";
import { findPeriodById } from "@/data/timeline";
import { ContentDetail } from "@/components/content/ContentDetail";
import { ContentCard } from "@/components/content/ContentCard";
import type { ContentType } from "@/types/content";

export function generateStaticParams() {
  return getAllContent().map((item) => ({
    type: item.type,
    slug: item.id,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  return params.then(({ type, slug }) => {
    const item = getContentBySlug(type as ContentType, slug);
    if (!item) return { title: "Not Found" };
    return {
      title: `${item.title} — 한국사 타임라인`,
      description: item.synopsis,
    };
  });
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const item = getContentBySlug(type as ContentType, slug);
  if (!item) notFound();

  const periodInfo = findPeriodById(item.period);

  // 같은 시기 관련 콘텐츠
  const related = getContentByPeriod(item.period)
    .filter((c) => c.id !== item.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:underline">
          전체
        </Link>
        {periodInfo && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/era/${periodInfo.era.id}`}
              className="hover:underline"
            >
              {periodInfo.era.name}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/era/${periodInfo.era.id}/${periodInfo.period.id}`}
              className="hover:underline"
            >
              {periodInfo.period.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{item.title}</span>
      </nav>

      <ContentDetail item={item} />

      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-lg font-semibold">
            같은 시기 다른 작품
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ContentCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
