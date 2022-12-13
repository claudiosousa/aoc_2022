import { promises as fs } from 'fs';

const moves = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split(' '))
  .map(l => [l[0], parseInt(l[1])]);

let visited = new Set();
let rope = [...new Array(10)].map(l => [0, 0]);

let moveNodeIfNecessary = iNode => {
  let prev = rope[iNode - 1];
  let node = rope[iNode];
  let dx = prev[0] - node[0];
  let dy = prev[1] - node[1];
  if (Math.abs(dx) > 1) {
    node[0] += Math.sign(dx);
    if (Math.abs(dy) >= 1) node[1] += Math.sign(dy);
  } else if (Math.abs(dy) > 1) {
    node[1] += Math.sign(dy);
    if (Math.abs(dx) >= 1) node[0] += Math.sign(dx);
  }
};

for (let [dir, dist] of moves) {
  for (let i = 0; i < dist; i++) {
    //console.log(h.join(';'), t.join(';'));
    switch (dir) {
      case 'R':
        rope[0][0]++;
        break;
      case 'L':
        rope[0][0]--;
        break;
      case 'U':
        rope[0][1]++;
        break;
      case 'D':
        rope[0][1]--;
        break;
    }
    for (let iNode = 1; iNode < rope.length; iNode++) {
      moveNodeIfNecessary(iNode);
      moveNodeIfNecessary(iNode);
    }
    visited.add(rope[rope.length - 1].join(';'));
  }
}

console.log(visited.size);
