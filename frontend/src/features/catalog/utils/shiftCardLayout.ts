const number = (value: number) => Number(value.toFixed(3));

export function pillPath(x: number, y: number, width = 18) {
  return `M ${x} ${y + 2.5} A 2.5 2.5 0 0 1 ${x + 2.5} ${y} L ${x + width - 2.5} ${y} A 2.5 2.5 0 0 1 ${x + width} ${y + 2.5} L ${x + width} ${y + 2.5} A 2.5 2.5 0 0 1 ${x + width - 2.5} ${y + 5} L ${x + 2.5} ${y + 5} A 2.5 2.5 0 0 1 ${x} ${y + 2.5} Z`;
}

/** Keep the supplied silhouette; reserve only the notch used by real labels. */
export function shiftCardLayout(labels: readonly string[]) {
  const rows = Math.ceil(labels.length / 3);
  const columns = rows ? Math.ceil(labels.length / rows) : 0;
  const extra = Math.max(0, rows - 1) * 7;
  const diagonal = Math.min(extra * 0.75, 15);
  const height = 42 + extra;
  const bottom = -140 + extra;
  const left = -116 - (columns * 18 + Math.max(0, columns - 1) * 4);
  const body = labels.length
    ? `M -218 -160 A 10 10 0 0 0 -208 -170 L -208 -177 A 3 3 0 0 1 -205 -180 L -119 -180 A 3 3 0 0 1 -116 -177 L -116 -151 A 3 3 0 0 1 -119 -148 L ${number(left + 1.5)} -148 A 3 3 0 0 0 ${number(left - 0.9)} -146.8 L ${number(left - 5.1 - diagonal)} ${number(bottom - 1.2)} A 3 3 0 0 1 ${number(left - 7.5 - diagonal)} ${bottom} L -225 ${bottom} A 3 3 0 0 1 -228 ${bottom - 3} L -228 -157 A 3 3 0 0 1 -225 -160 Z`
    : "M -218 -160 A 10 10 0 0 0 -208 -170 L -208 -177 A 3 3 0 0 1 -205 -180 L -119 -180 A 3 3 0 0 1 -116 -177 L -116 -143 A 3 3 0 0 1 -119 -140 L -225 -140 A 3 3 0 0 1 -228 -143 L -228 -157 A 3 3 0 0 1 -225 -160 Z";
  const tags: { label: string; x: number; y: number; path: string }[] = [];
  for (let row = 0, index = 0; row < rows; row++) {
    // Balance rows: four labels use 2+2, seven use 3+2+2.
    const rowCount =
      Math.floor(labels.length / rows) + (row < labels.length % rows ? 1 : 0);
    for (let column = 0; column < rowCount; column++, index++) {
      const x = -116 - rowCount * 18 - (rowCount - 1) * 4 + column * 22;
      const y = -145 + row * 7;
      tags.push({ label: labels[index], x, y, path: pillPath(x, y) });
    }
  }
  return { height, body, tags };
}
