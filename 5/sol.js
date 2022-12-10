import { promises as fs } from 'fs';

const [stacks_str, moves_str] = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split(/^\n/m);

const stacks = stacks_str
  .split('\n')
  .slice(0, -2)
  .reduce(
    (acc, line) => {
      for (let i = 0; i < 9; i++) {
        const p = 1 + i * 4;
        if (line.length > p && line[p] != ' ') acc[i].unshift(line[p]);
      }
      return acc;
    },
    [...new Array(9)].map(() => [])
  );

const moves = moves_str
  .split('\n')
  .filter(l => l)
  .map(l => l.match(/([0-9]+)/g).map(n => parseInt(n)));

for (let [creates, from, to] of moves) {
  //  console.log(creates, from, to);
  stacks[to - 1].push(...stacks[from - 1].splice(-creates).reverse());
  //  console.log(stacks);
}

const top_creates = stacks
  .flatMap(c => (c.length == 0 ? [] : c.slice(-1)))
  .join('');

console.log(top_creates);
