import Link from "next/link";
import { TIMELINE } from "@/data/timeline";

const ERA_COLORS: Record<string, string> = {
  gojoseon: "bg-era-gojoseon",
  samguk: "bg-era-samguk",
  "unified-silla": "bg-era-unified",
  goryeo: "bg-era-goryeo",
  joseon: "bg-era-joseon",
  empire: "bg-era-empire",
  japanese: "bg-era-japanese",
  modern: "bg-era-modern",
};

export function EraNav() {
  return (
    <nav className="border-t border-border">
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 scrollbar-none">
        <ol className="flex gap-1.5 py-2 text-xs font-medium">
          <li className="shrink-0">
            <Link
              href="/"
              className="inline-flex whitespace-nowrap items-center rounded-full border border-border px-3 py-1 text-muted transition-colors hover:bg-card-hover hover:text-foreground"
            >
              전체
            </Link>
          </li>
          {TIMELINE.map((era) => (
            <li key={era.id} className="shrink-0">
              <Link
                href={`/era/${era.id}`}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-3 py-1 text-muted transition-colors hover:bg-card-hover hover:text-foreground"
              >
                <span
                  className={`inline-block h-2 w-2 shrink-0 rounded-full ${ERA_COLORS[era.id] ?? "bg-muted"}`}
                />
                {era.name}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
