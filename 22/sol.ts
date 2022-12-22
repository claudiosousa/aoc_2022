const parts = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l);

const path = parts[parts.length - 1]
  .match(/(?:([0-9]+)|(R|L))/g)!
  .map(p => (p == 'R' || p == 'L' ? p : parseInt(p)))
  , map_str = parts.slice(0, parts.length - 1);

const map_width = map_str.reduce((acc, l) => Math.max(acc, l.length), 0);
const map =
  map_str.map(l => l.length == map_width ? l : l + ' '.repeat(map_width - l.length))
    .map(l => l.split(''));

type Direction = 0 | 1 | 2 | 3;
type Position = {x: number, y: number;};
let pos = {y: 0, x: map[0].findIndex(c => c == '.')},
  dir: Direction = 0;

const getNextPos = (pos: Position, dir: Direction) => {
  const next_pos = {...pos};
  switch (dir) {
    case 0:
      next_pos.x += 1;
      break;
    case 1:
      next_pos.y += 1;
      break;
    case 2:
      next_pos.x -= 1;
      break;
    case 3:
      next_pos.y -= 1;
      break;
  }
  if (next_pos.x < 0 || next_pos.y < 0 || next_pos.x >= map_width || next_pos.y >= map.length)
    return undefined;
  return next_pos;
};

const move = (steps: number) => {
  for (let i = 0; i < steps; i++) {
    let next_pos = getNextPos(pos, dir);
    if (next_pos == undefined || map[next_pos.y][next_pos.x] == ' ') {
      const reverse_dir = <Direction>((dir + 2) % 4);
      let next_reverse_pos: Position | undefined = pos;
      do {
        next_pos = next_reverse_pos;
        next_reverse_pos = getNextPos(next_pos, reverse_dir);
      } while (next_reverse_pos != undefined && map[next_reverse_pos.y][next_reverse_pos.x] != ' ');
    }
    const next_case = map[next_pos.y][next_pos.x];
    if (next_case == '.')
      pos = next_pos;
    else if (next_case == '#')
      return;
  }
};

const changeDir = (turn: 'L' | 'R') => dir = <Direction>((dir + (turn == 'R' ? 1 : 3)) % 4);


for (let i = 0; i < path.length; i++) {
  if (i % 2 == 0)
    move(<number>path[i]);
  else
    changeDir(<'L' | 'R'>path[i]);
}

console.log((pos.y + 1) * 1000 + (pos.x + 1) * 4 + dir);


