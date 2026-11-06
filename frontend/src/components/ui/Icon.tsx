const paths: Record<string, string> = {
  refresh: "M20 7v5h-5 M4 17v-5h5 M6 6a8 8 0 0 1 13 3 M18 18A8 8 0 0 1 5 15",
  minimize: "M5 12h14",
  maximize: "M5 5h14v14H5z",
  crown: "M3 6l4 4 5-7 5 7 4-4-2 13H5z M6 22h12",
  bot: "M8 4h8 M12 2v2 M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M1 12v4 M23 12v4 M8 12h.01 M16 12h.01 M9 16h6",
  box: "m12 3 9 5v9l-9 5-9-5V8z M3 8l9 5 9-5 M12 13v9 M7.5 5.5l9 5",
  search: "m20 20-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  text: "M4 5h16 M12 5v15 M8 20h8",
  image: "M3 3h18v18H3z M3 16l6-6 5 5 3-3 4 4 M15 7h.01",
  video: "M3 5h13v14H3z M16 10l5-3v10l-5-3",
  audio: "M4 9v6 M8 5v14 M12 2v20 M16 6v12 M20 9v6",
  code: "m8 5-6 7 6 7 M16 5l6 7-6 7 M14 3l-4 18",
  work: "M4 7h16v14H4z M8 7V3h8v4 M4 12h16 M10 12v3h4v-3",
  research: "M9 3h6 M10 3v6l-7 11h18L14 9V3 M7 14h10",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  external: "M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7",
  close: "m5 5 14 14 M19 5 5 19",
  star: "m12 2 2.8 6.2L22 9l-5.2 4.8 1.5 7.2L12 17.3 5.7 21l1.5-7.2L2 9l7.2-.8z",
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
