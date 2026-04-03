import { TimelineView } from "@/components/timeline/TimelineView";
import { getAllContent } from "@/lib/content";

export default function Home() {
  const allContent = getAllContent();
  const movieCount = allContent.filter((c) => c.type === "movie").length;
  const dramaCount = allContent.filter((c) => c.type === "drama").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          한국사 타임라인
        </h1>
        <p className="mt-2 text-muted">
          고조선부터 현대까지, 한국 역사를 다룬 영화 {movieCount}편과 드라마{" "}
          {dramaCount}편을 시대별로 탐색하세요.
        </p>
      </section>

      <TimelineView />
    </div>
  );
}
