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
      <div className="mx-auto max-w-6xl overflow-x-auto px-4">
        <ol className="flex gap-1 py-2 text-xs font-medium">
          <li>
            <Link
              href="/"
              className="rounded-full border border-border px-3 py-1 text-muted transition-colors hover:bg-card-hover hover:text-foreground"
            >
              전체
            </Link>
          </li>
          {TIMELINE.map((era) => (
            <li key={era.id}>
              <Link
                href={`/era/${era.id}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border px-3 py-1 text-muted transition-colors hover:bg-card-hover hover:text-foreground"
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${ERA_COLORS[era.id] ?? "bg-muted"}`}
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
