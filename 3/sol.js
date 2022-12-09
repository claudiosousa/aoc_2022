import { promises as fs } from 'fs';

const priority_sum = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(line => {
    const bag1 = new Set(line.slice(0, line.length / 2).split(''));
    const bag2 = new Set(line.slice(line.length / 2).split(''));
    return [...bag1].filter(t => bag2.has(t))[0];
  })
  // item types a through z have priorities 1 through 26.
  // item types A through Z have priorities 27 through 52.
  .map(t =>
    t < 'a'
      ? t.charCodeAt(0) - 'A'.charCodeAt(0) + 27
      : t.charCodeAt(0) - 'a'.charCodeAt(0) + 1
  )
  .reduce((acc, v) => acc + v, 0);

console.log(priority_sum);
