import { promises as fs } from 'fs';

const arr = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split('').map(c => parseInt(c)));

const height = arr.length;
const width = arr[0].length;
let invisible = [...new Array(height)].map(() =>
  [...new Array(width)].map(() => true)
);

for (let i = 0; i < height; i++) {
  let [max_height_inc, max_height_dec] = [-1, -1];
  for (let j = 0; j < width; j++) {
    invisible[i][j] &= arr[i][j] <= max_height_inc;
    invisible[i][width - j - 1] &= arr[i][width - j - 1] <= max_height_dec;
    max_height_inc = Math.max(max_height_inc, arr[i][j]);
    max_height_dec = Math.max(max_height_dec, arr[i][width - j - 1]);
  }
}

for (let j = 0; j < width; j++) {
  let [max_height_inc, max_height_dec] = [-1, -1];
  for (let i = 0; i < height; i++) {
    invisible[i][j] &= arr[i][j] <= max_height_inc;
    invisible[height - 1 - i][j] &= arr[height - 1 - i][j] <= max_height_dec;
    max_height_inc = Math.max(max_height_inc, arr[i][j]);
    max_height_dec = Math.max(max_height_dec, arr[height - 1 - i][j]);
  }
}

console.log(
  invisible.reduce((s, l) => s + l.reduce((s, c) => s + (c == 0 ? 1 : 0), 0), 0)
);
