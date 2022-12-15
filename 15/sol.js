import { promises as fs } from 'fs';

let sensor_beacons = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => [...l.matchAll(/(x|y)=([\-0-9]+)/g)].map(m => parseInt(m[2])));

const target_row_y = 2000000;
let target_row_beacons_x = new Set();
sensor_beacons
  .filter(([, , , by]) => by == target_row_y)
  .forEach(([, , bx]) => target_row_beacons_x.add(bx));

const beaconless_ranges = sensor_beacons
  .map(([sx, sy, bx, by]) => {
    let dist = Math.abs(bx - sx) + Math.abs(by - sy);
    let target_row_x_dist = dist - Math.abs(target_row_y - sy);
    if (target_row_x_dist < 0) return null;
    return [sx - target_row_x_dist, sx + target_row_x_dist];
  })
  .filter(dist => dist)
  .sort((a, b) => (a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]));

const [x_min, x_max] = beaconless_ranges.reduce(
  ([x_min, x_max], [x1, x2]) => [Math.min(x1, x_min), Math.max(x2, x_max)],
  [Infinity, 0]
);

// console.log(target_row_beacons_x);
// console.log(beaconless_ranges);
// console.log(x_min, x_max);

const calculateBeaconslessPositions = () => {
  let beaconless_positions = 0;
  let iranges = 0;
  for (let x = x_min; x <= x_max; x++) {
    if (target_row_beacons_x.has(x)) continue;
    while (beaconless_ranges[iranges][1] < x) {
      iranges++;
      if (iranges >= beaconless_ranges.length) return beaconless_positions;
    }
    if (beaconless_ranges[iranges][0] <= x) beaconless_positions++;
  }
  return beaconless_positions;
};
let beaconless_positions = calculateBeaconslessPositions();
console.log(beaconless_positions);
