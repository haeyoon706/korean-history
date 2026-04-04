"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // /era/joseon/... → "joseon"
  const activeEraId = pathname.startsWith("/era/")
    ? pathname.split("/")[2]
    : null;

  // /era/joseon/joseon-seonjo → "joseon-seonjo"
  const activePeriodId = pathname.startsWith("/era/")
    ? pathname.split("/")[3] ?? null
    : null;

  const activeEra = activeEraId
    ? TIMELINE.find((e) => e.id === activeEraId)
    : null;

  return (
    <nav className="border-t border-border">
      {/* Era row */}
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 scrollbar-none">
        <ol className="flex gap-1.5 py-2 text-xs font-medium">
          <li className="shrink-0">
            <Link
              href="/"
              className={`inline-flex whitespace-nowrap items-center rounded-full border px-3 py-1 transition-colors ${
                !activeEraId
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              전체
            </Link>
          </li>
          {TIMELINE.map((era) => {
            const isActive = era.id === activeEraId;
            return (
              <li key={era.id} className="shrink-0">
                <Link
                  href={`/era/${era.id}`}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 transition-colors ${
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                      isActive ? "bg-background" : (ERA_COLORS[era.id] ?? "bg-muted")
                    }`}
                  />
                  {era.name}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Period row */}
      {activeEra && activeEra.periods.length > 1 && (
        <div className="border-t border-border bg-card/50">
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 scrollbar-none">
            <ol className="flex gap-1.5 py-2 text-xs">
              <li className="shrink-0">
                <Link
                  href={`/era/${activeEra.id}`}
                  className={`inline-flex whitespace-nowrap items-center rounded-full border px-2.5 py-0.5 transition-colors ${
                    !activePeriodId
                      ? "border-foreground/30 bg-foreground/10 font-medium text-foreground"
                      : "border-border text-muted hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  전체
                </Link>
              </li>
              {activeEra.periods.map((period) => {
                const isActive = period.id === activePeriodId;
                return (
                  <li key={period.id} className="shrink-0">
                    <Link
                      href={`/era/${activeEra.id}/${period.id}`}
                      className={`inline-flex whitespace-nowrap items-center rounded-full border px-2.5 py-0.5 transition-colors ${
                        isActive
                          ? "border-foreground/30 bg-foreground/10 font-medium text-foreground"
                          : "border-border text-muted hover:bg-card-hover hover:text-foreground"
                      }`}
                    >
                      {period.name}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </nav>
  );
}
