import moviesData from "@/data/movies.json";
import dramasData from "@/data/dramas.json";
import type { Content, ContentType, Movie, Drama } from "@/types/content";
import { TIMELINE } from "@/data/timeline";

const movies = moviesData as Movie[];
const dramas = dramasData as Drama[];
const allContent: Content[] = [...movies, ...dramas];

export function getAllContent(): Content[] {
  return allContent;
}

export function getContentByEra(eraId: string): Content[] {
  const era = TIMELINE.find((e) => e.id === eraId);
  if (!era) return [];
  const periodIds = new Set(era.periods.map((p) => p.id));
  return allContent.filter((item) => periodIds.has(item.period));
}

export function getContentByPeriod(periodId: string): Content[] {
  return allContent.filter((item) => item.period === periodId);
}

export function getContentBySlug(
  type: ContentType,
  slug: string
): Content | undefined {
  return allContent.find((item) => item.type === type && item.id === slug);
}

export function filterContent(
  items: Content[],
  filters: { type?: ContentType; query?: string }
): Content[] {
  let result = items;

  if (filters.type) {
    result = result.filter((item) => item.type === filters.type);
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
        item.synopsis.toLowerCase().includes(q) ||
        (item.cast && item.cast.some((c) => c.toLowerCase().includes(q))) ||
        (item.director && item.director.toLowerCase().includes(q))
    );
  }

  return result;
}

export function getContentCountByPeriod(
  periodId: string
): { total: number; movies: number; dramas: number } {
  const items = getContentByPeriod(periodId);
  return {
    total: items.length,
    movies: items.filter((i) => i.type === "movie").length,
    dramas: items.filter((i) => i.type === "drama").length,
  };
}
