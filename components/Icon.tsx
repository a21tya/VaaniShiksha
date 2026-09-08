import type { CSSProperties } from "react";
export type IconName = "home" | "teacher" | "edit" | "book" | "students" | "audio" | "translate" | "chart" | "check" | "arrow" | "globe" | "spark" | "search" | "bookmark";
const paths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8",
  teacher: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3",
  edit: "M12 4H4v16h16v-8M15 3l6 6M10 14l2-6 6-6 4 4-6 6-6 2Z",
  book: "M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v16M5 8h4M15 8h4M5 12h4M15 12h4",
  students: "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6 21v-3a6 6 0 0 1 12 0v3M3 5a3 3 0 0 1 0 6M21 5a3 3 0 0 0 0 6M2 20v-4l2-2M22 20v-4l-2-2",
  audio: "M4 9h4l5-5v16l-5-5H4V9ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14",
  translate: "M2 5h12M8 2v3M4 8l8 8M12 5c0 6-4 10-10 12M14 21l4-11 4 11M15 18h6",
  chart: "M4 20v-6h3v6M11 20V9h3v11M18 20V3h3v17",
  check: "m7 12 3 3 7-7M21 12a9 9 0 1 1-5-8",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  search: "M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1 5 6 6",
  bookmark: "M6 3h12v18l-6-4-6 4V3Z",
};
export default function Icon({ name, size = 22, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
