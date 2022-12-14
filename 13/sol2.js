import { promises as fs } from 'fs';

const isOrdered = (p1, p2) => {
  if (Number.isInteger(p1) && Number.isInteger(p2))
    return p1 < p2 ? -1 : p1 > p2 ? 1 : 0;
  if (Number.isInteger(p1)) p1 = [p1];
  if (Number.isInteger(p2)) p2 = [p2];
  for (let i = 0; i < p1.length; i++) {
    if (i >= p2.length) return 1;
    let ordered = isOrdered(p1[i], p2[i]);
    if (ordered != 0) return ordered;
  }
  return p2.length > p1.length ? -1 : 0;
};

let packets = [
  ...(await fs.readFile('./input.txt', 'utf-8'))
    .toString()
    .split('\n')
    .filter(l => l)
    .map(l => eval(l)),
  [[2]],
  [[6]],
].sort((a, b) => isOrdered(a, b));

const idx1 =
  packets.findIndex(a => JSON.stringify(a) == JSON.stringify([[2]])) + 1;
const idx2 =
  packets.findIndex(a => JSON.stringify(a) == JSON.stringify([[6]])) + 1;
console.log(idx1 * idx2);
