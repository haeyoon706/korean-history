import type { Content } from "@/types/content";
import { findPeriodById } from "@/data/timeline";

export function ContentDetail({ item }: { item: Content }) {
  const isMovie = item.type === "movie";
  const periodInfo = findPeriodById(item.period);

  return (
    <article>
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
            isMovie ? "bg-blue-600" : "bg-purple-600"
          }`}
        >
          {isMovie ? "영화" : "드라마"}
        </span>
        <span className="text-sm text-muted">{item.year}년</span>
      </div>

      <h1 className="text-3xl font-bold">{item.title}</h1>
      {item.titleEn && (
        <p className="mt-1 text-lg text-muted">{item.titleEn}</p>
      )}

      <p className="mt-4 leading-relaxed">{item.synopsis}</p>

      <dl className="mt-8 space-y-3 text-sm">
        <div className="flex gap-3">
          <dt className="w-20 shrink-0 font-medium text-muted">배경</dt>
          <dd>
            {item.settingYear < 0
              ? `BC ${Math.abs(item.settingYear)}년`
              : `${item.settingYear}년`}
          </dd>
        </div>

        {periodInfo && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">시대</dt>
            <dd>
              {periodInfo.era.name} &gt; {periodInfo.period.name}
            </dd>
          </div>
        )}

        {item.director && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">
              {isMovie ? "감독" : "연출"}
            </dt>
            <dd>{item.director}</dd>
          </div>
        )}

        {item.cast && item.cast.length > 0 && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">출연</dt>
            <dd>{item.cast.join(", ")}</dd>
          </div>
        )}

        {isMovie && (item as Content & { type: "movie" }).boxOffice && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">관객수</dt>
            <dd>{(item as Content & { type: "movie" }).boxOffice}</dd>
          </div>
        )}

        {!isMovie && (item as Content & { type: "drama" }).network && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">방송사</dt>
            <dd>{(item as Content & { type: "drama" }).network}</dd>
          </div>
        )}

        {!isMovie && (item as Content & { type: "drama" }).episodes && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 font-medium text-muted">회차</dt>
            <dd>{(item as Content & { type: "drama" }).episodes}부작</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
