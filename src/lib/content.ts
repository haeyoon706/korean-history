import moviesData from "@/data/movies.json";
import dramasData from "@/data/dramas.json";
import type { Content, ContentType, Movie, Drama } from "@/types/content";
import { TIMELINE } from "@/data/timeline";

const movies = moviesData as Movie[];
const dramas = dramasData as Drama[];
const allContent: Content[] = [...movies, ...dramas];

export type SortKey = "timeline" | "year-asc" | "year-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "timeline", label: "타임라인순" },
  { value: "year-asc", label: "제작연도 오래된 순" },
  { value: "year-desc", label: "제작연도 최신순" },
];

export function sortContent(items: Content[], sort: SortKey): Content[] {
  const sorted = [...items];
  switch (sort) {
    case "timeline":
      return sorted.sort((a, b) => a.settingYear - b.settingYear);
    case "year-asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    default:
      return sorted;
  }
}

export function parseSortKey(value: string | undefined): SortKey {
  if (value === "year-asc" || value === "year-desc") return value;
  return "timeline";
}

export function getAllContent(sort: SortKey = "timeline"): Content[] {
  return sortContent(allContent, sort);
}

export function getContentByEra(
  eraId: string,
  sort: SortKey = "timeline"
): Content[] {
  const era = TIMELINE.find((e) => e.id === eraId);
  if (!era) return [];
  const periodIds = new Set(era.periods.map((p) => p.id));
  return sortContent(
    allContent.filter((item) => periodIds.has(item.period)),
    sort
  );
}

export function getContentByPeriod(
  periodId: string,
  sort: SortKey = "timeline"
): Content[] {
  return sortContent(
    allContent.filter((item) => item.period === periodId),
    sort
  );
}

export function getContentBySlug(
  type: ContentType,
  slug: string
): Content | undefined {
  return allContent.find((item) => item.type === type && item.id === slug);
}

export function filterContent(
  items: Content[],
  filters: { type?: ContentType; query?: string; sort?: SortKey }
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

  if (filters.sort) {
    result = sortContent(result, filters.sort);
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
