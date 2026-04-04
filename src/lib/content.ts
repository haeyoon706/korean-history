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

