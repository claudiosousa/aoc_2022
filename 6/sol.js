import { promises as fs } from 'fs';

const start =
  (await fs.readFile('./input.txt', 'utf-8'))
    .toString()
    .split('')
    .findIndex((v, i, arr) => new Set([...arr.slice(i, i + 4)]).size == 4) + 4;

console.log(start);
