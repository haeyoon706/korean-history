import Link from "next/link";
import { EraNav } from "./EraNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          한국사 타임라인
        </Link>
        <p className="text-xs text-muted">
          영화·드라마로 보는 한국 역사
        </p>
      </div>
      <EraNav />
    </header>
  );
}
