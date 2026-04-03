import Link from "next/link";
import type { Content } from "@/types/content";

export function ContentCard({ item }: { item: Content }) {
  const isMovie = item.type === "movie";

  return (
    <Link
      href={`/content/${item.type}/${item.id}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card-hover"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${
            isMovie ? "bg-blue-600" : "bg-purple-600"
          }`}
        >
          {isMovie ? "영화" : "드라마"}
        </span>
        <span className="text-xs text-muted">{item.year}</span>
      </div>

      <h3 className="font-bold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {item.title}
      </h3>
      {item.titleEn && (
        <p className="mt-0.5 text-xs text-muted">{item.titleEn}</p>
      )}

      <p className="mt-2 line-clamp-2 text-sm text-muted">{item.synopsis}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
        {item.director && <span>감독: {item.director}</span>}
        {item.cast && item.cast.length > 0 && (
          <span>출연: {item.cast.slice(0, 3).join(", ")}</span>
        )}
        {isMovie && (item as Content & { type: "movie" }).boxOffice && (
          <span>관객: {(item as Content & { type: "movie" }).boxOffice}</span>
        )}
        {!isMovie && (item as Content & { type: "drama" }).episodes && (
          <span>{(item as Content & { type: "drama" }).episodes}부작</span>
        )}
      </div>
    </Link>
  );
}
