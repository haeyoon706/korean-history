import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-muted">404</h1>
      <p className="mt-4 text-lg">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
      >
        타임라인으로 돌아가기
      </Link>
    </div>
  );
}
