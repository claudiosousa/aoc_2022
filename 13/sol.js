import { promises as fs } from 'fs';

const isOrdered = ([p1, p2]) => {
  if (Number.isInteger(p1) && Number.isInteger(p2))
    return p1 < p2 ? true : p1 > p2 ? false : null;
  if (Number.isInteger(p1)) p1 = [p1];
  if (Number.isInteger(p2)) p2 = [p2];
  for (let i = 0; i < p1.length; i++) {
    if (i >= p2.length) return false;
    let ordered = isOrdered([p1[i], p2[i]]);
    if (ordered != null) return ordered;
  }
  return p2.length > p1.length ? true : null;
};

let sum_indices = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => eval(l))
  .reduce((acc, v, i) => {
    if (i % 2 == 0) acc.push([v]);
    else acc[acc.length - 1].push(v);
    return acc;
  }, [])
  .map(ps => isOrdered(ps) != false)
  .flatMap((ordered, i) => (ordered ? i + 1 : null))
  .reduce((acc, v) => acc + v);

console.log(sum_indices);
