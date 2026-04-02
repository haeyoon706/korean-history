# CLAUDE.md — Korean History (Next.js)

## Project Overview
한국사 학습 웹 애플리케이션. Next.js 기반 프로젝트.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (필요 시)
- **Package Manager**: pnpm

## Commands
```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 실행
pnpm type-check   # tsc --noEmit
```

## Project Structure
```
src/
├── app/              # App Router (pages, layouts, routes)
│   ├── (routes)/     # Route groups
│   ├── api/          # Route Handlers
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # UI 컴포넌트
│   ├── ui/           # 범용 UI (Button, Input, Modal 등)
│   └── features/     # 도메인별 컴포넌트
├── hooks/            # Custom hooks
├── lib/              # 유틸리티, 헬퍼, 설정
├── types/            # 공유 타입 정의
├── constants/        # 상수
└── styles/           # 글로벌 스타일
```

## Architecture Rules

### 컴포넌트 설계
- **Server Component가 기본**. `'use client'`는 반드시 필요할 때만 선언한다.
- 클라이언트 컴포넌트는 트리의 최하단(leaf)으로 밀어낸다.
- 하나의 컴포넌트 파일은 **200줄을 넘기지 않는다**. 넘으면 분리한다.
- Props가 5개를 초과하면 **객체로 묶거나 컴포넌트 분리**를 검토한다.
- `children` 패턴을 적극 활용해 합성(composition)으로 설계한다.

### 파일 & 네이밍
- 컴포넌트: `PascalCase.tsx` (예: `TimelineCard.tsx`)
- 유틸/훅/상수: `camelCase.ts` (예: `useDebounce.ts`, `formatDate.ts`)
- 타입 파일: `camelCase.ts` (예: `dynasty.ts`)
- 디렉토리: `kebab-case` (예: `route-handlers/`)
- Boolean 변수/props: `is`, `has`, `should` 접두사 (예: `isLoading`, `hasError`)

### TypeScript
- `any` 사용 금지. 불가피하면 `unknown` + 타입 가드를 사용한다.
- 인터페이스보다 `type`을 기본으로 사용한다 (확장이 필요한 경우에만 `interface`).
- API 응답, DB 모델 등 외부 데이터는 반드시 **런타임 검증** (zod 등)을 거친다.
- `as` 타입 단언 최소화. 필요하면 왜 안전한지 주석을 남긴다.
- `enum` 대신 `as const` 객체를 사용한다.

### 상태 관리
- **서버 상태는 Server Component + fetch**로 처리한다. 클라이언트 캐시(React Query 등)는 정말 필요할 때만.
- 클라이언트 상태는 가능한 한 `useState`/`useReducer`로 로컬에 둔다.
- 전역 상태가 필요하면 Zustand를 사용하되, store를 도메인 단위로 분리한다.
- URL 상태(필터, 페이지네이션 등)는 `searchParams`를 활용한다.

### 데이터 페칭
- App Router의 `fetch` + `cache`/`revalidate` 옵션을 기본으로 사용한다.
- Server Action은 form 처리와 mutation에 사용한다.
- 에러 처리: `error.tsx`, `not-found.tsx` 바운더리를 라우트마다 배치한다.
- loading UI: `loading.tsx` 또는 `<Suspense>`를 적절히 활용한다.

### 스타일링
- Tailwind CSS 유틸리티 클래스를 기본으로 사용한다.
- 반복되는 스타일 조합은 컴포넌트로 추출한다 (`@apply` 남용 금지).
- 반응형: mobile-first (`sm:`, `md:`, `lg:` 순서).
- 다크 모드 지원 시 `dark:` variant를 사용한다.
- 매직 넘버 금지. spacing, color는 Tailwind 토큰을 쓴다.

### 성능
- `next/image`를 반드시 사용한다. `<img>` 태그 직접 사용 금지.
- `next/font`로 폰트를 로드한다.
- `next/link`로 네비게이션한다. `<a>` 태그 직접 사용은 외부 링크만.
- Dynamic import (`next/dynamic`)는 무거운 클라이언트 컴포넌트에 적용한다.
- 불필요한 리렌더링 방지: `memo`는 측정 후에만 적용. 추측으로 최적화하지 않는다.

### 에러 처리 & 접근성
- 사용자에게 보여주는 에러 메시지는 한국어로 작성한다.
- `try-catch`는 실제 복구 로직이 있을 때만 사용한다. catch 후 무시 금지.
- 시맨틱 HTML을 사용한다 (`<nav>`, `<main>`, `<article>`, `<section>` 등).
- 인터랙티브 요소에 키보드 접근성을 보장한다.
- `alt` 텍스트를 반드시 작성한다.

### 코드 품질
- 한 함수는 한 가지 일만 한다.
- 조건부 렌더링이 3단계 이상 중첩되면 **별도 컴포넌트로 추출**한다.
- 주석은 "왜(why)"를 설명할 때만 작성한다. "무엇(what)"은 코드로 표현한다.
- 매직 넘버, 매직 스트링은 상수로 추출한다.
- 커밋 전 `pnpm lint && pnpm type-check`가 통과해야 한다.

### 금지 사항
- `console.log` 커밋 금지 (디버깅용 logger 사용).
- `// @ts-ignore`, `// @ts-expect-error` 사용 금지 (불가피하면 사유 주석 필수).
- `!important` 사용 금지.
- 인라인 스타일 사용 금지 (동적 값 바인딩 제외).
- `useEffect`로 파생 상태를 계산하지 않는다 — `useMemo`나 렌더링 중 계산으로 해결한다.
- `index.tsx`에 로직을 넣지 않는다 — re-export 용도로만 사용한다.

## 한국어 프로젝트 컨벤션
- UI 텍스트, 에러 메시지: 한국어
- 코드(변수명, 함수명, 주석): 영어
- 커밋 메시지: 한국어 또는 영어 (일관성 유지)
- README, 문서: 한국어
