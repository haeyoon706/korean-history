"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortKey } from "@/lib/content";

export function SortSelect({ current }: { current: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "timeline") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-card-hover"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
