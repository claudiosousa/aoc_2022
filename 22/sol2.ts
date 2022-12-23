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

const cube_side = 50;
const move = (steps: number) => {
  for (let i = 0; i < steps; i++) {
    //console.log(pos, dir);
    let next_pos = getNextPos(pos, dir);
    let next_dir = dir;
    if (next_pos == undefined || map[next_pos.y][next_pos.x] == ' ') {
      next_pos = {...pos};
      // https://imgur.com/a/nSZNgkm
      if (pos.y < cube_side && pos.x < cube_side * 2) {
        // side +Z
        switch (dir) {
          case 2:
            next_pos.x = 0;
            next_pos.y = cube_side * 3 - 1 - next_pos.y;
            next_dir = 0;
            break;
          case 3:
            next_pos.y = next_pos.x + 2 * cube_side;
            next_pos.x = 0;
            next_dir = 0;
            break;
        }
      }
      else if (pos.y < cube_side && pos.x >= cube_side * 2) {
        // side +X
        switch (dir) {
          case 0:
            next_pos.x = cube_side * 2 - 1;
            next_pos.y = cube_side * 3 - 1 - next_pos.y;
            next_dir = 2;
            break;
          case 1:
            next_pos.y = next_pos.x - cube_side;
            next_pos.x = cube_side * 2 - 1;
            next_dir = 2;
            break;
          case 3:
            next_pos.y = cube_side * 4 - 1;
            next_pos.x = next_pos.x - 2 * cube_side;
            next_dir = 3;
            break;
        }
      }
      else if (pos.y >= cube_side && pos.y < cube_side * 2) {
        // side +Y
        switch (dir) {
          case 0:
            next_pos.x = cube_side + next_pos.y;
            next_pos.y = cube_side - 1;
            next_dir = 3;
            break;
          case 2:
            next_pos.x = next_pos.y - cube_side;
            next_pos.y = cube_side * 2;
            next_dir = 1;
            break;
        }
      }
      else if (pos.y < cube_side * 3 && pos.x < cube_side) {
        // side -X
        switch (dir) {
          case 2:
            next_pos.y = cube_side * 3 - 1 - next_pos.y;
            next_pos.x = cube_side;
            next_dir = 0;
            break;
          case 3:
            next_pos.y = next_pos.x + cube_side;
            next_pos.x = cube_side;
            next_dir = 0;
            break;
        }
      }
      else if (pos.y >= cube_side * 2 && pos.x >= cube_side) {
        // side -Z
        switch (dir) {
          case 0:
            next_pos.y = cube_side * 3 - 1 - next_pos.y;
            next_pos.x = cube_side * 3 - 1;
            next_dir = 2;
            break;
          case 1:
            next_pos.y = next_pos.x + cube_side * 2;
            next_pos.x = cube_side - 1;
            next_dir = 2;
            break;
        }
      }
      else if (pos.y >= cube_side * 3) {
        // side -Y
        switch (dir) {
          case 0:
            next_pos.x = next_pos.y - cube_side * 2;
            next_pos.y = cube_side * 3 - 1;
            next_dir = 3;
            break;
          case 1:
            next_pos.x = next_pos.x + cube_side * 2;
            next_pos.y = 0;
            next_dir = 1;
            break;
          case 2:
            next_pos.x = next_pos.y - cube_side * 2;
            next_pos.y = 0;
            next_dir = 1;
            break;
        }
      }
    }
    //console.log('Next ', next_pos, dir);
    const next_case = map[next_pos.y][next_pos.x];
    if (next_case == '.') {
      pos = next_pos;
      dir = next_dir;
    }
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


