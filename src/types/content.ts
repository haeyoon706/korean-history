export type ContentType = "movie" | "drama";

export type HistoricalEra =
  | "고대"
  | "고조선"
  | "삼국시대"
  | "고구려"
  | "백제"
  | "신라"
  | "가야"
  | "발해"
  | "고려"
  | "조선"
  | "구한말"
  | "일제강점기"
  | "현대사";

export type Movie = {
  id: string;
  title: string;
  titleEn: string | null;
  year: number;
  type: "movie";
  era: HistoricalEra;
  period: string;
  settingYear: number;
  director: string;
  cast: string[] | null;
  synopsis: string;
  boxOffice: string | null;
};

export type Drama = {
  id: string;
  title: string;
  titleEn: string | null;
  year: number;
  type: "drama";
  era: HistoricalEra;
  period: string;
  settingYear: number;
  network: string;
  episodes: number | null;
  director: string | null;
  cast: string[] | null;
  synopsis: string;
};

export type Content = Movie | Drama;
