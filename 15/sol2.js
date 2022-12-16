import { promises as fs } from 'fs';

let sensor_beacons = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => [...l.matchAll(/(x|y)=([\-0-9]+)/g)].map(m => parseInt(m[2])));

const beaconless_ranges = sensor_beacons.map(([sx, sy, bx, by]) => [
  sx,
  sy,
  Math.abs(bx - sx) + Math.abs(by - sy),
]);

const [c_min, c_max] = [0, 4000000];

console.log(beaconless_ranges);

const findBeacon = () => {
  let row_beaconless_ranges = beaconless_ranges.map(b => [...b, -1, -1]);
  const adaptBeaconlessRasngeToRow = row_y => {
    row_beaconless_ranges.forEach(range => {
      const row_h_range = range[2] - Math.abs(row_y - range[1]);
      if (row_h_range < 0) {
        range[3] = -1;
        range[4] = -1;
      }
      range[3] = range[0] - row_h_range;
      range[4] = range[0] + row_h_range;
    });
    row_beaconless_ranges.sort((a, b) =>
      a[3] != b[3] ? a[3] - b[3] : a[4] - b[4]
    );
  };

  for (let y = c_min; y <= c_max; y++) {
    let x = c_min;
    let ibeacon = 0;
    adaptBeaconlessRasngeToRow(y);
    while (x <= c_max) {
      while (
        ibeacon < row_beaconless_ranges.length - 1 &&
        row_beaconless_ranges[ibeacon][4] < x
      ) {
        ibeacon++;
      }
      if (row_beaconless_ranges[ibeacon][3] <= x)
        x = row_beaconless_ranges[ibeacon][4] + 1;
      else return x * 4000000 + y;
    }
  }
  return -1;
};
const beacon_pos = findBeacon();
console.log(beacon_pos);
