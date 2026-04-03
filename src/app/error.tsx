"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
      <p className="mt-2 text-muted">잠시 후 다시 시도해주세요.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
      >
        다시 시도
      </button>
    </div>
  );
}
