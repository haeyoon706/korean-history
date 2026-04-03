import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/data");

// ─── 왕/사건 키워드 → 대표 배경 연도 ───
const KEYWORD_YEARS = [
  // 고조선·삼국
  { keywords: ["단군"], year: -2333 },
  { keywords: ["주몽", "고구려 건국"], year: -37 },
  { keywords: ["온조", "백제 건국"], year: -18 },
  { keywords: ["김수로", "가야"], year: 42 },
  { keywords: ["광개토"], year: 400 },
  { keywords: ["연개소문"], year: 642 },
  { keywords: ["안시성", "당태종", "645"], year: 645 },
  { keywords: ["황산벌", "660", "백제 멸망"], year: 660 },
  { keywords: ["평양성", "668", "고구려 멸망"], year: 668 },
  { keywords: ["대조영", "발해 건국"], year: 698 },

  // 통일신라
  { keywords: ["장보고"], year: 828 },
  { keywords: ["선덕여왕", "미실"], year: 632 },
  { keywords: ["김춘추", "삼국통일", "태종무열왕"], year: 654 },
  { keywords: ["화랑", "진흥왕"], year: 540 },

  // 고려
  { keywords: ["왕건", "궁예", "견훤", "후삼국", "고려 건국"], year: 918 },
  { keywords: ["천추태후"], year: 1009 },
  { keywords: ["거란", "여요 전쟁"], year: 1018 },
  { keywords: ["무신", "최충헌"], year: 1170 },
  { keywords: ["팔만대장경", "대몽", "김준"], year: 1236 },
  { keywords: ["기황후", "충선왕"], year: 1320 },
  { keywords: ["공민왕", "신돈"], year: 1365 },
  { keywords: ["최영", "위화도"], year: 1388 },
  { keywords: ["쌍화점", "고려 말기"], year: 1370 },

  // 조선 - 태조·태종
  { keywords: ["정도전", "조선 건국"], year: 1392 },
  { keywords: ["이방원", "태종"], year: 1400 },
  { keywords: ["원경왕후"], year: 1398 },

  // 세종
  { keywords: ["세종", "한글", "훈민정음"], year: 1443 },
  { keywords: ["장영실"], year: 1430 },

  // 세조·예종·성종
  { keywords: ["단종", "수양대군"], year: 1453 },
  { keywords: ["세조", "사육신"], year: 1456 },
  { keywords: ["한명회"], year: 1460 },
  { keywords: ["인수대비", "성종"], year: 1470 },

  // 연산군·중종
  { keywords: ["연산군", "장녹수"], year: 1500 },
  { keywords: ["중종", "대장금", "조광조"], year: 1515 },
  { keywords: ["단경왕후", "7일 만에 폐위"], year: 1506 },

  // 인종·명종
  { keywords: ["명종", "문정왕후", "정난정"], year: 1550 },
  { keywords: ["임꺽정"], year: 1559 },

  // 선조 (임진왜란)
  { keywords: ["임진왜란"], year: 1592 },
  { keywords: ["이순신", "명량"], year: 1597 },
  { keywords: ["한산도"], year: 1592 },
  { keywords: ["노량"], year: 1598 },
  { keywords: ["선조"], year: 1585 },

  // 광해군
  { keywords: ["광해군", "광해"], year: 1615 },
  { keywords: ["인목대비"], year: 1618 },
  { keywords: ["정명공주"], year: 1616 },

  // 인조 (병자호란)
  { keywords: ["병자호란"], year: 1636 },
  { keywords: ["인조"], year: 1630 },
  { keywords: ["남한산성"], year: 1636 },
  { keywords: ["청나라에 끌려"], year: 1637 },

  // 숙종
  { keywords: ["숙종"], year: 1690 },
  { keywords: ["장희빈", "인현왕후"], year: 1694 },
  { keywords: ["숙빈 최씨", "동이"], year: 1693 },
  { keywords: ["춘향"], year: 1700 },

  // 경종·영조
  { keywords: ["영조", "연잉군"], year: 1730 },
  { keywords: ["사도세자", "뒤주"], year: 1762 },
  { keywords: ["경종"], year: 1720 },

  // 정조
  { keywords: ["정조", "이산"], year: 1780 },
  { keywords: ["정약전", "흑산도", "자산어보"], year: 1801 },
  { keywords: ["성덕임", "의빈 성씨"], year: 1782 },
  { keywords: ["백동수"], year: 1770 },

  // 순조·헌종·철종
  { keywords: ["철종"], year: 1850 },
  { keywords: ["순조"], year: 1810 },
  { keywords: ["흥선대원군"], year: 1863 },
  { keywords: ["취화선", "장승업"], year: 1870 },

  // 구한말·대한제국
  { keywords: ["고종"], year: 1880 },
  { keywords: ["명성황후"], year: 1895 },
  { keywords: ["을사늑약", "을사조약"], year: 1905 },
  { keywords: ["동학", "녹두꽃", "1894"], year: 1894 },

  // 일제강점기
  { keywords: ["3.1운동", "유관순"], year: 1919 },
  { keywords: ["안중근", "이토 히로부미", "하얼빈"], year: 1909 },
  { keywords: ["의열단"], year: 1923 },
  { keywords: ["봉오동"], year: 1920 },
  { keywords: ["윤동주"], year: 1941 },
  { keywords: ["박열", "관동대지진"], year: 1923 },
  { keywords: ["김두한", "종로"], year: 1935 },
  { keywords: ["위안부"], year: 1940 },
  { keywords: ["징용", "군함도"], year: 1943 },
  { keywords: ["조선어학회", "사전"], year: 1940 },
  { keywords: ["엄복동", "자전거"], year: 1920 },

  // 현대사
  { keywords: ["해방"], year: 1945 },
  { keywords: ["한국전쟁", "6.25"], year: 1950 },
  { keywords: ["4.19", "제2공화국"], year: 1960 },
  { keywords: ["5.16", "제3공화국", "박정희"], year: 1961 },
  { keywords: ["유신", "제4공화국"], year: 1972 },
  { keywords: ["5.18", "광주", "12.12", "제5공화국", "전두환"], year: 1980 },
  { keywords: ["1987", "6월 민주항쟁", "박종철"], year: 1987 },
];

// ─── synopsis에서 배경 연도 추출 ───
function extractExplicitYear(text) {
  // "1970년대 방영", "1970년대 사극" 등 제작 시기 패턴은 제외
  const cleaned = text.replace(/\d{4}년대\s*(방영|사극|제작|방송)/g, "");
  // "1597년", "645년" 등 패턴
  const match = cleaned.match(/(\d{3,4})년/);
  if (match) {
    const y = parseInt(match[1], 10);
    // 합리적 범위: 역사적 배경 (100~1960), 1961 이후는 현대사 키워드로 처리
    if (y >= 100 && y <= 1960) return y;
  }
  return null;
}

// ─── Period startYear 폴백용 ───
const PERIOD_DEFAULTS = {
  gojoseon: -2333,
  goguryeo: -37,
  baekje: -18,
  silla: -57,
  gaya: 42,
  "unified-silla": 668,
  balhae: 698,
  "goryeo-early": 918,
  "goryeo-military": 1170,
  "goryeo-mongol": 1270,
  "goryeo-late": 1356,
  "joseon-taejo": 1392,
  "joseon-sejong": 1418,
  "joseon-sejo": 1452,
  "joseon-yeonsangun": 1494,
  "joseon-injong": 1544,
  "joseon-seonjo": 1567,
  "joseon-gwanghaegun": 1608,
  "joseon-injo": 1623,
  "joseon-hyojong": 1649,
  "joseon-sukjong": 1674,
  "joseon-gyeongjong": 1720,
  "joseon-jeongjo": 1776,
  "joseon-sunjo": 1800,
  "joseon-gojong": 1863,
  "joseon-general": 1500,
  "daehan-empire": 1897,
  "japanese-early": 1910,
  "japanese-march": 1925,
  "japanese-war": 1940,
  "modern-liberation": 1945,
  "modern-republic": 1965,
  "modern-democracy": 1987,
};

function classifySettingYear(item) {
  const text = `${item.title} ${item.synopsis || ""}`;

  // 1. synopsis에서 명시적 연도 추출 (가장 정확)
  const explicit = extractExplicitYear(item.synopsis || "");
  if (explicit) return explicit;

  // 2. 키워드 매칭
  for (const rule of KEYWORD_YEARS) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.year;
    }
  }

  // 3. period의 startYear 폴백
  return PERIOD_DEFAULTS[item.period] ?? 0;
}

// ─── Main ───
const movies = JSON.parse(readFileSync(join(dataDir, "movies.json"), "utf-8"));
const dramas = JSON.parse(readFileSync(join(dataDir, "dramas.json"), "utf-8"));

let fallbackCount = 0;

function processItems(items, label) {
  return items.map((item) => {
    const settingYear = classifySettingYear(item);

    // Check if it fell back to period default
    if (settingYear === PERIOD_DEFAULTS[item.period]) {
      fallbackCount++;
    }

    return { ...item, settingYear };
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

console.log(`✅ Movies: ${migratedMovies.length}편 settingYear 할당 완료`);
console.log(`✅ Dramas: ${migratedDramas.length}편 settingYear 할당 완료`);
console.log(`📊 Period 기본값 폴백: ${fallbackCount}편`);

// settingYear 분포 확인
const yearSamples = [...migratedMovies, ...migratedDramas]
  .sort((a, b) => a.settingYear - b.settingYear)
  .slice(0, 10);
console.log("\n📋 타임라인순 상위 10편:");
yearSamples.forEach((i) =>
  console.log(`   ${i.settingYear}년 | ${i.title} (${i.period})`)
);

const yearSamplesEnd = [...migratedMovies, ...migratedDramas]
  .sort((a, b) => b.settingYear - a.settingYear)
  .slice(0, 10);
console.log("\n📋 타임라인순 하위 10편:");
yearSamplesEnd.forEach((i) =>
  console.log(`   ${i.settingYear}년 | ${i.title} (${i.period})`)
);
