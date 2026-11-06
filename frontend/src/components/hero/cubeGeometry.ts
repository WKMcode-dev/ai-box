// Orthographic projection: yaw changes, height and tilt remain constant.
type Point = [number, number, number];
const faces: Point[][] = [
  [
    [-23, -23, 23],
    [23, -23, 23],
    [23, 23, 23],
    [-23, 23, 23],
  ],
  [
    [23, -23, 23],
    [23, -23, -23],
    [23, 23, -23],
    [23, 23, 23],
  ],
  [
    [23, -23, -23],
    [-23, -23, -23],
    [-23, 23, -23],
    [23, 23, -23],
  ],
  [
    [-23, -23, -23],
    [-23, -23, 23],
    [-23, 23, 23],
    [-23, 23, -23],
  ],
  [
    [-23, -23, -23],
    [23, -23, -23],
    [23, -23, 23],
    [-23, -23, 23],
  ],
];
export function cubeFaces(angle: number) {
  const c = Math.cos(angle),
    s = Math.sin(angle);
  const rotated = faces.map((face) =>
    face.map(([x, y, z]) => [x * c + z * s, y, z * c - x * s] as Point),
  );
  return rotated
    .map((face, index) => {
      const points = face.map(([x, y, z]) => [x, y * 0.866 + z * 0.5]);
      const [a, b, , d] = points;
      const area =
        (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      return {
        index,
        visible: area > 0.01,
        points: points.map((p) => p.join(",")).join(" "),
        matrix: `matrix(${(b[0] - a[0]) / 46} ${(b[1] - a[1]) / 46} ${(d[0] - a[0]) / 46} ${(d[1] - a[1]) / 46} ${a[0]} ${a[1]})`,
      };
    })
    .filter((face) => face.visible);
}
