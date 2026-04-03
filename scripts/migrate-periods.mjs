import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/data");

// ─── Era → Period 단순 매핑 (비조선) ───
const ERA_TO_PERIOD = {
  고대: "gojoseon",
  고조선: "gojoseon",
  삼국시대: "goguryeo", // default, will refine by synopsis
  고구려: "goguryeo",
  백제: "baekje",
  신라: "silla",
  가야: "gaya",
  발해: "balhae",
  고려: "goryeo-early", // default, will refine
  구한말: "daehan-empire",
  일제강점기: "japanese-march", // default, will refine
  현대사: "modern-republic", // default, will refine
};

// ─── 조선 시대 키워드 → period 매핑 (우선순위 높은 것부터) ───
const JOSEON_KEYWORDS = [
  // 태조·태종
  {
    period: "joseon-taejo",
    keywords: [
      "조선 건국",
      "이성계",
      "태조",
      "이방원",
      "태종",
      "정도전",
      "정종",
      "건국기",
      "조선 건국 과정",
      "고려 말에서 조선",
      "고려 말 조선",
    ],
  },
  // 세종
  {
    period: "joseon-sejong",
    keywords: [
      "세종",
      "한글 창제",
      "훈민정음",
      "장영실",
      "문종",
      "집현전",
    ],
  },
  // 세조·예종·성종
  {
    period: "joseon-sejo",
    keywords: [
      "세조",
      "수양대군",
      "사육신",
      "단종",
      "예종",
      "성종",
      "인수대비",
      "한명회",
    ],
  },
  // 연산군·중종
  {
    period: "joseon-yeonsangun",
    keywords: [
      "연산군",
      "중종",
      "장녹수",
      "조광조",
      "대장금",
      "물괴",
      "7일 만에 폐위",
      "단경왕후",
    ],
  },
  // 인종·명종
  {
    period: "joseon-injong",
    keywords: [
      "인종",
      "명종",
      "임꺽정",
      "문정왕후",
      "정난정",
      "을사사화",
    ],
  },
  // 선조 (임진왜란)
  {
    period: "joseon-seonjo",
    keywords: [
      "임진왜란",
      "이순신",
      "명량",
      "한산",
      "노량",
      "선조",
      "왜군",
      "의주로 파천",
      "학익진",
    ],
  },
  // 광해군
  {
    period: "joseon-gwanghaegun",
    keywords: [
      "광해군",
      "광해",
      "인목대비",
      "정명공주",
    ],
  },
  // 인조 (병자호란)
  {
    period: "joseon-injo",
    keywords: [
      "병자호란",
      "인조",
      "남한산성",
      "청나라에 끌려",
      "1636",
      "1639",
      "일지매",
    ],
  },
  // 효종·현종
  {
    period: "joseon-hyojong",
    keywords: ["효종", "현종"],
  },
  // 숙종
  {
    period: "joseon-sukjong",
    keywords: [
      "숙종",
      "장희빈",
      "인현왕후",
      "숙빈 최씨",
      "동이",
      "연잉군",
    ],
  },
  // 경종·영조
  {
    period: "joseon-gyeongjong",
    keywords: [
      "경종",
      "영조",
      "사도세자",
      "뒤주",
      "백동수",
    ],
  },
  // 정조
  {
    period: "joseon-jeongjo",
    keywords: ["정조", "이산", "정약전", "흑산도", "의빈 성씨", "성덕임"],
  },
  // 순조·헌종·철종
  {
    period: "joseon-sunjo",
    keywords: [
      "순조",
      "헌종",
      "철종",
      "세도정치",
      "흥선대원군",
      "홍경래",
      "탐관오리",
      "민란",
      "바람과 구름과 비",
    ],
  },
  // 고종
  {
    period: "joseon-gojong",
    keywords: ["고종", "대원군", "명성황후"],
  },
];

// ─── 고려 세부 분류 ───
const GORYEO_KEYWORDS = [
  {
    period: "goryeo-early",
    keywords: ["왕건", "태조", "건국", "후삼국", "궁예", "견훤", "천추태후", "거란"],
  },
  {
    period: "goryeo-military",
    keywords: ["무신", "대몽", "팔만대장경", "김준", "최충헌"],
  },
  {
    period: "goryeo-mongol",
    keywords: ["원나라", "원 간섭", "기황후", "충선왕", "충렬왕"],
  },
  {
    period: "goryeo-late",
    keywords: [
      "고려 말",
      "공민왕",
      "신돈",
      "최영",
      "이성계",
      "정도전",
      "위화도",
    ],
  },
];

// ─── 일제강점기 세부 분류 ───
const JAPANESE_KEYWORDS = [
  {
    period: "japanese-early",
    keywords: ["3.1운동", "유관순", "1919", "을사늑약", "1910년대"],
  },
  {
    period: "japanese-march",
    keywords: [
      "1920",
      "1930",
      "의열단",
      "안중근",
      "윤동주",
      "독립운동",
      "상해",
      "경성",
      "만주",
      "봉오동",
      "하얼빈",
      "박열",
      "김두한",
      "종로",
      "위안부",
      "조선어학회",
      "사전",
    ],
  },
  {
    period: "japanese-war",
    keywords: [
      "1937",
      "1940",
      "징용",
      "군함도",
      "전쟁",
      "해방",
      "1945",
      "자전거",
    ],
  },
];

// ─── 현대사 세부 분류 ───
const MODERN_KEYWORDS = [
  {
    period: "modern-liberation",
    keywords: ["해방", "한국전쟁", "6.25", "1950년대", "제1공화국"],
  },
  {
    period: "modern-republic",
    keywords: [
      "1960",
      "1970",
      "1980",
      "5.18",
      "광주",
      "유신",
      "군사",
      "12.12",
      "전두환",
      "박정희",
      "4.19",
      "모래시계",
      "제2공화국",
      "제3공화국",
      "제4공화국",
      "제5공화국",
    ],
  },
  {
    period: "modern-democracy",
    keywords: ["1987", "6월 민주항쟁", "민주화", "박종철"],
  },
];

// ─── 특정 작품 직접 매핑 (키워드로 잡기 어려운 경우) ───
const TITLE_OVERRIDES = {
  // 조선 - 시기 특정 어려운 작품들
  "춘향뎐": "joseon-sukjong",
  "성춘향": "joseon-sukjong",
  "스캔들: 조선남녀상열지사": "joseon-sukjong",
  "방자전": "joseon-sukjong",
  "황진이": "joseon-yeonsangun",
  "황진이 (2007)": "joseon-yeonsangun",
  "음란서생": "joseon-sukjong",
  "전우치": "joseon-injo",
  "창궐": "joseon-gwanghaegun",
  "킹덤": "joseon-injo",
  "킹덤: 아신전": "joseon-injo",
  "해적: 바다로 간 산적": "joseon-taejo",
  "해적: 도깨비 깃발": "joseon-taejo",
  "바람과 함께 사라지다": "joseon-sunjo",
  "조선미녀삼총사": "joseon-sunjo",
  "조선마술사": "joseon-sunjo",
  "궁합": "joseon-sunjo",
  "천군": "joseon-seonjo",
  "검객": "joseon-injo",
  "흥부: 글로 세상을 바꾼 자": "joseon-sunjo",
  "환혼": "joseon-gwanghaegun",
  "환혼: 빛과 그림자": "joseon-gwanghaegun",
  "조선 정신과 의사 유세풍": "joseon-sukjong",
  "조선 정신과 의사 유세풍 2": "joseon-sukjong",
  "철인왕후": "joseon-sunjo",
  "시크릿 로얄 인스펙션": "joseon-sukjong",
  "암행어사: 조선비밀수사단": "joseon-sukjong",
  "조선로코 - 녹두전": "joseon-gwanghaegun",
  "꽃파당: 조선혼담공작소": "joseon-gwanghaegun",
  "간택 - 여인들의 전쟁": "joseon-sukjong",
  "바람과 구름과 비 (2020)": "joseon-sunjo",
  "바람과 구름과 비": "joseon-sunjo",
  "군주 - 가면의 주인": "joseon-gwanghaegun",
  "100일의 낭군님": "joseon-gwanghaegun",
  "아랑사또전": "joseon-general",
  "야경꾼 일지": "joseon-general",
  "천명: 조선판 도망자": "joseon-seonjo",
  "마의": "joseon-sejo",
  "왕이 된 남자": "joseon-gwanghaegun",
  "왕의 얼굴": "joseon-seonjo",
  "대박": "joseon-sukjong",
  "홍천기": "joseon-general",
  "연모": "joseon-general",
  "세작, 매혹된 자들": "joseon-gyeongjong",
  "원경": "joseon-taejo",
  "귀궁": "joseon-general",
  "이강에는 달이 흐른다": "joseon-general",
  "취화선": "joseon-sunjo",
  "풍운": "joseon-general",
  "서궁": "joseon-sejo",
  "쾌도 홍길동": "joseon-yeonsangun",
  "바람의 화원": "joseon-jeongjo",
  "성균관 스캔들": "joseon-jeongjo",
  "해를 품은 달": "joseon-general",
  "밤을 걷는 선비": "joseon-general",
  "구르미 그린 달빛": "joseon-general",
  "슈룹": "joseon-general",
  "조선왕조 오백년": "joseon-general",
  // 삼국시대
  "황산벌": "baekje",
  // 고려
  "조선명탐정: 각시투구꽃의 비밀": "joseon-sunjo",
  "조선명탐정: 사라진 놉의 딸": "joseon-sunjo",
  "조선명탐정: 흡혈괴마의 비밀": "joseon-sunjo",
  "광대들: 풍문조작단": "joseon-gwanghaegun",
  // 드라마 추가
  "다모": "joseon-sukjong",
  "상도": "joseon-sukjong",
  "허준": "joseon-seonjo",
  "추노": "joseon-injo",
  "신의": "goryeo-late",
  "각시탈": "japanese-march",
  // 현대사
  "서편제": "modern-republic",
  "정년이": "modern-liberation",
  // 구한말
  "제중원": "daehan-empire",
  "녹두꽃": "daehan-empire",
  "미스터 션샤인": "daehan-empire",
  "조선 거너": "daehan-empire",
  // 아스달 연대기 - 가상 고대
  "아스달 연대기": "gojoseon",
  "아스달 연대기: 아라문의 검": "gojoseon",
  // 현대사 공화국 시리즈 매핑
  "제1공화국": "modern-liberation",
  "제2공화국": "modern-republic",
  "제3공화국": "modern-republic",
  "제4공화국": "modern-republic",
  "제5공화국": "modern-republic",
  "빛과 그림자": "modern-republic",
};

function classifyPeriod(item) {
  // 1. 제목 직접 매핑 우선
  if (TITLE_OVERRIDES[item.title]) {
    return TITLE_OVERRIDES[item.title];
  }

  const text = `${item.title} ${item.synopsis || ""}`;

  // 2. 조선 시대 세부 분류
  if (item.era === "조선") {
    for (const rule of JOSEON_KEYWORDS) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.period;
      }
    }
    return "joseon-general";
  }

  // 3. 고려 세부 분류
  if (item.era === "고려") {
    for (const rule of GORYEO_KEYWORDS) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.period;
      }
    }
    return "goryeo-early";
  }

  // 4. 일제강점기 세부 분류
  if (item.era === "일제강점기") {
    for (const rule of JAPANESE_KEYWORDS) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.period;
      }
    }
    return "japanese-march";
  }

  // 5. 현대사 세부 분류
  if (item.era === "현대사") {
    for (const rule of MODERN_KEYWORDS) {
      if (rule.keywords.some((kw) => text.includes(kw))) {
        return rule.period;
      }
    }
    return "modern-republic";
  }

  // 6. 삼국시대 - synopsis로 세부 분류
  if (item.era === "삼국시대") {
    if (text.includes("백제") || text.includes("황산벌")) return "baekje";
    if (text.includes("신라")) return "silla";
    if (text.includes("가야")) return "gaya";
    return "goguryeo";
  }

  // 7. 기타 era → 단순 매핑
  return ERA_TO_PERIOD[item.era] || "gojoseon";
}

function generateId(item, index, existingIds) {
  let base;
  if (item.titleEn) {
    base = item.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  } else {
    base = `${item.type}-${index}`;
  }

  // Ensure uniqueness
  let id = base;
  let counter = 2;
  while (existingIds.has(id)) {
    id = `${base}-${counter}`;
    counter++;
  }
  existingIds.add(id);
  return id;
}

// ─── Main ───
const movies = JSON.parse(readFileSync(join(dataDir, "movies.json"), "utf-8"));
const dramas = JSON.parse(readFileSync(join(dataDir, "dramas.json"), "utf-8"));

const existingIds = new Set();
const unmatched = [];

function processItems(items, label) {
  return items.map((item, i) => {
    const period = classifyPeriod(item);
    const id = generateId(item, i, existingIds);

    if (period.endsWith("-general")) {
      unmatched.push(`[${label}] ${item.title} → ${period}`);
    }

    return { id, ...item, period };
  });
}

const migratedMovies = processItems(movies, "영화");
const migratedDramas = processItems(dramas, "드라마");

writeFileSync(
  join(dataDir, "movies.json"),
  JSON.stringify(migratedMovies, null, 2),
  "utf-8"
);
writeFileSync(
  join(dataDir, "dramas.json"),
  JSON.stringify(migratedDramas, null, 2),
  "utf-8"
);

// ─── 결과 보고 ───
console.log(`✅ Movies: ${migratedMovies.length}편 처리 완료`);
console.log(`✅ Dramas: ${migratedDramas.length}편 처리 완료`);

if (unmatched.length > 0) {
  console.log(`\n⚠️  시기 미상 (joseon-general 등): ${unmatched.length}편`);
  unmatched.forEach((s) => console.log(`   ${s}`));
}

// Period별 집계
const periodCounts = {};
[...migratedMovies, ...migratedDramas].forEach((item) => {
  periodCounts[item.period] = (periodCounts[item.period] || 0) + 1;
});

console.log("\n📊 Period별 집계:");
Object.entries(periodCounts)
  .sort(([, a], [, b]) => b - a)
  .forEach(([period, count]) => {
    console.log(`   ${period}: ${count}편`);
  });
