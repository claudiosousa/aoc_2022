const map = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map(l => l.split(''));

const elfs = new Map();
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] != '#') {
      continue;
    }
    elfs.set([x, y].join(), [x, y]);
  }
}

const move_directions = [
  [
    [0, -1],
    [-1, -1],
    [1, -1],
  ],
  [
    [0, 1],
    [-1, 1],
    [1, 1],
  ],
  [
    [-1, 0],
    [-1, -1],
    [-1, 1],
  ],
  [
    [1, 0],
    [1, -1],
    [1, 1],
  ],
];

let p = 0;
let elfs_moved = false;
do {
  elfs_moved = false
  const proposals = new Map();
  for (const [elfx, elfy] of elfs.values()) {
    if (
      move_directions.every(dir =>
        dir.every(([dx, dy]) => !elfs.has([elfx + dx, elfy + dy].join()))
      )
    ) {
      continue;
    }
    elfs_moved = true;

    let move = undefined;
    for (let i = 0; i < 4; i++) {
      const move_maybe = move_directions[(p + i) % 4];
      if (
        move_maybe.every(([dx, dy]) => !elfs.has([elfx + dx, elfy + dy].join()))
      ) {
        move = move_maybe[0];
        break;
      }
    }
    if (!move) continue;
    const new_pos = [elfx + move[0], elfy + move[1]];
    const move_proposal_key = new_pos.join();
    if (!proposals.has(move_proposal_key)) {
      proposals.set(move_proposal_key, []);
    }
    proposals.get(move_proposal_key).push([elfx, elfy, new_pos]);
  }
  for (let prop of proposals.values()) {
    if (prop.length > 1) {
      continue;
    }
    prop = prop[0];
    elfs.delete([prop[0], prop[1]].join());
    elfs.set(prop[2].join(), prop[2]);
  }
  p++;
} while (elfs_moved);

console.log(p);
