import { promises as fs } from 'fs'

const lines = (await fs.readFile('./input.txt', 'utf-8')).toString().split('\n')
const numbers = lines.map(x => parseInt(x))


const accumulated = numbers.reduce(
  (acc, val) =>
    isNaN(val) ? [Math.max(acc[0], acc[1]), 0] : [acc[0], acc[1] + val],
  [0, 0]
);
console.log(accumulated);

