export type Period = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
};

export type Era = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  periods: Period[];
};

export const TIMELINE: Era[] = [
  {
    id: "gojoseon",
    name: "고조선",
    startYear: -2333,
    endYear: -108,
    color: "#8B6914",
    periods: [
      { id: "gojoseon", name: "고조선", startYear: -2333, endYear: -108 },
    ],
  },
  {
    id: "samguk",
    name: "삼국시대",
    startYear: -57,
    endYear: 668,
    color: "#2D5016",
    periods: [
      { id: "goguryeo", name: "고구려", startYear: -37, endYear: 668 },
      { id: "baekje", name: "백제", startYear: -18, endYear: 660 },
      { id: "silla", name: "신라", startYear: -57, endYear: 935 },
      { id: "gaya", name: "가야", startYear: 42, endYear: 562 },
    ],
  },
  {
    id: "unified-silla",
    name: "남북국시대",
    startYear: 668,
    endYear: 935,
    color: "#1B4D3E",
    periods: [
      { id: "unified-silla", name: "통일신라", startYear: 668, endYear: 935 },
      { id: "balhae", name: "발해", startYear: 698, endYear: 926 },
    ],
  },
  {
    id: "goryeo",
    name: "고려",
    startYear: 918,
    endYear: 1392,
    color: "#4A0E4E",
    periods: [
      { id: "goryeo-early", name: "고려 전기", startYear: 918, endYear: 1170 },
      {
        id: "goryeo-military",
        name: "무신정권",
        startYear: 1170,
        endYear: 1270,
      },
      {
        id: "goryeo-mongol",
        name: "원 간섭기",
        startYear: 1270,
        endYear: 1356,
      },
      {
        id: "goryeo-late",
        name: "고려 말기",
        startYear: 1356,
        endYear: 1392,
      },
    ],
  },
  {
    id: "joseon",
    name: "조선",
    startYear: 1392,
    endYear: 1910,
    color: "#1A237E",
    periods: [
      {
        id: "joseon-taejo",
        name: "태조·정종·태종",
        startYear: 1392,
        endYear: 1418,
      },
      {
        id: "joseon-sejong",
        name: "세종·문종",
        startYear: 1418,
        endYear: 1452,
      },
      {
        id: "joseon-sejo",
        name: "세조·예종·성종",
        startYear: 1452,
        endYear: 1494,
      },
      {
        id: "joseon-yeonsangun",
        name: "연산군·중종",
        startYear: 1494,
        endYear: 1544,
      },
      {
        id: "joseon-injong",
        name: "인종·명종",
        startYear: 1544,
        endYear: 1567,
      },
      {
        id: "joseon-seonjo",
        name: "선조 (임진왜란)",
        startYear: 1567,
        endYear: 1608,
      },
      {
        id: "joseon-gwanghaegun",
        name: "광해군",
        startYear: 1608,
        endYear: 1623,
      },
      {
        id: "joseon-injo",
        name: "인조 (병자호란)",
        startYear: 1623,
        endYear: 1649,
      },
      {
        id: "joseon-hyojong",
        name: "효종·현종",
        startYear: 1649,
        endYear: 1674,
      },
      {
        id: "joseon-sukjong",
        name: "숙종",
        startYear: 1674,
        endYear: 1720,
      },
      {
        id: "joseon-gyeongjong",
        name: "경종·영조",
        startYear: 1720,
        endYear: 1776,
      },
      {
        id: "joseon-jeongjo",
        name: "정조",
        startYear: 1776,
        endYear: 1800,
      },
      {
        id: "joseon-sunjo",
        name: "순조·헌종·철종",
        startYear: 1800,
        endYear: 1863,
      },
      {
        id: "joseon-gojong",
        name: "고종 (구한말)",
        startYear: 1863,
        endYear: 1910,
      },
      {
        id: "joseon-general",
        name: "시기 미상",
        startYear: 1392,
        endYear: 1910,
      },
    ],
  },
  {
    id: "empire",
    name: "대한제국·구한말",
    startYear: 1897,
    endYear: 1910,
    color: "#B71C1C",
    periods: [
      {
        id: "daehan-empire",
        name: "대한제국",
        startYear: 1897,
        endYear: 1910,
      },
    ],
  },
  {
    id: "japanese",
    name: "일제강점기",
    startYear: 1910,
    endYear: 1945,
    color: "#424242",
    periods: [
      {
        id: "japanese-early",
        name: "일제강점기 전기",
        startYear: 1910,
        endYear: 1919,
      },
      {
        id: "japanese-march",
        name: "3.1운동 이후",
        startYear: 1919,
        endYear: 1937,
      },
      {
        id: "japanese-war",
        name: "전시체제",
        startYear: 1937,
        endYear: 1945,
      },
    ],
  },
  {
    id: "modern",
    name: "현대사",
    startYear: 1945,
    endYear: 2026,
    color: "#0D47A1",
    periods: [
      {
        id: "modern-liberation",
        name: "해방·한국전쟁",
        startYear: 1945,
        endYear: 1953,
      },
      {
        id: "modern-republic",
        name: "민주화 이전",
        startYear: 1953,
        endYear: 1987,
      },
      {
        id: "modern-democracy",
        name: "민주화 이후",
        startYear: 1987,
        endYear: 2026,
      },
    ],
  },
];

export function findEraById(eraId: string): Era | undefined {
  return TIMELINE.find((era) => era.id === eraId);
}

export function findPeriodById(periodId: string): {
  era: Era;
  period: Period;
} | undefined {
  for (const era of TIMELINE) {
    const period = era.periods.find((p) => p.id === periodId);
    if (period) return { era, period };
  }
  return undefined;
}

export function findEraByPeriodId(periodId: string): Era | undefined {
  return TIMELINE.find((era) => era.periods.some((p) => p.id === periodId));
}
