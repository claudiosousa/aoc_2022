import { promises as fs } from 'fs';

const moves = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split(' '))
  .map(l => [l[0], parseInt(l[1])]);

let visited = new Set();
let [h, t] = [
  [0, 0],
  [0, 0],
];

let moveTailIfNecessary = dim => {
  let delta = h[dim] - t[dim];
  if (Math.abs(delta) > 1) {
    t[dim] += Math.sign(delta);
    t[(dim + 1) % 2] = h[(dim + 1) % 2];
  }
};

for (let [dir, dist] of moves) {
  for (let i = 0; i < dist; i++) {
    //console.log(h.join(';'), t.join(';'));
    switch (dir) {
      case 'R':
        h[0]++;
        break;
      case 'L':
        h[0]--;
        break;
      case 'U':
        h[1]++;
        break;
      case 'D':
        h[1]--;
        break;
    }
    moveTailIfNecessary(0);
    moveTailIfNecessary(1);
    visited.add(t.join(';'));
  }
}

console.log(visited.size);
