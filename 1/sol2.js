import { promises as fs } from 'fs';

const lines = (await fs.readFile('./input.txt', 'utf-8')).toString().split('\n');
const numbers = lines.map(x => parseInt(x));

const accumulated = numbers.reduce(
  (acc, val) => {
    if (isNaN(val)) {
      acc.push(0);
    } else {
      acc[acc.length - 1] += val;
    }
    return acc;
  },
  [0]
);

console.log(
  accumulated
    .sort()
    .slice(-4, -1)
    .reduce((acc, val) => acc + val, 0)
);
