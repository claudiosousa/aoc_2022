import { promises as fs } from 'fs';

let stones = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split('->').map(p => p.split(',').map(n => parseInt(n))));

const [min_w, max_w, min_h, max_h] = stones.reduce(
  ([min_w, max_w, min_h, max_h], s) => {
    let [w1, w2, h1, h2] = s.reduce(
      ([min_w, max_w, min_h, max_h], [w, h]) => [
        Math.min(w, min_w),
        Math.max(w, max_w),
        Math.min(h, min_h),
        Math.max(h, max_h),
      ],
      [Infinity, 0, Infinity, 0]
    );
    return [
      Math.min(w1, min_w),
      Math.max(w2, max_w),
      Math.min(h1, min_h),
      Math.max(h2, max_h),
    ];
  },
  [Infinity, 0, Infinity, 0]
);

let [start_x, width] = [min_w - 1, max_w - min_w + 3];
let floor = max_h + 1;
let wall = [...new Array(floor + 1)].map(_ =>
  [...new Array(width)].map(_ => 0)
);

//console.log(min_w, max_w, min_h, max_h, start_x, width, floor);

stones.forEach(ps => {
  let [lastx, lasty] = ps[0];
  ps.forEach(([x, y]) => {
    let [minx, maxx, miny, maxy] = [
      Math.min(lastx, x),
      Math.max(lastx, x),
      Math.min(lasty, y),
      Math.max(lasty, y),
    ];
    for (let i = minx; i <= maxx; i++)
      for (let j = miny; j <= maxy; j++) wall[j][i - start_x] = 1;
    lastx = x;
    lasty = y;
  });
});

const faireTomberSable = () => {
  let sand_units = 0;
  while (true) {
    let [x, y] = [500 - start_x, 0];
    sand_units++;
    while (true) {
      while (wall[y + 1][x] == 0) {
        y++;
        if (y >= floor) return sand_units - 1;
      }
      if (wall[y + 1][x - 1] == 0) {
        y++;
        x--;
      } else if (wall[y + 1][x + 1] == 0) {
        y++;
        x++;
      } else {
        wall[y][x] = 2;
        break;
      }
    }
  }
};

console.log(faireTomberSable());
// console.log(
//   wall
//     .map(l =>
//       l.map(c => (c == 0 ? '_' : c == 1 ? '#' : c == 2 ? 'o' : c)).join('')
//     )
//     .join('\n')
// );
