import Queue from '../utils/queue.js';

type Direction = 0 | 1 | 2 | 3;
type Position = {x: number; y: number;};
type Blizzard = Position & {dir: Direction;};

const blizzards_chars = ['>', 'v', '<', '^'];
const map = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map((l, y) => l.split(''));

let blizzards = new Map<string, Blizzard[]>();
const walls = new Map();

map.map((l, y) =>
  l.forEach((c, x) => {
    if (c == '.') return;
    if (c == '#') {
      walls.set([x, y].join(), {x, y});
    } else {
      const dir = blizzards_chars.findIndex(bc => bc == c);
      if (dir >= 0)
        blizzards.set([x, y].join(), [{x, y, dir: <Direction>dir}]);
    }
  })
);

const start: Position = {x: 1, y: 0};
const end: Position = {
  x: map[map.length - 1].findIndex(c => c == '.')!,
  y: map.length - 1,
};
const map_size = {width: map[0].length, height: map.length};

const moveBlizzard = (blizzard: Blizzard) => {
  switch (blizzard.dir) {
    case 0:
      blizzard.x = blizzard.x == map_size.width - 2 ? 1 : blizzard.x + 1;
      break;
    case 1:
      blizzard.y = blizzard.y == map_size.height - 2 ? 1 : blizzard.y + 1;
      break;
    case 2:
      blizzard.x = blizzard.x == 1 ? map_size.width - 2 : blizzard.x - 1;
      break;
    case 3:
      blizzard.y = blizzard.y == 1 ? map_size.height - 2 : blizzard.y - 1;
      break;
  }
};

const moveBlizzards = () => {
  const next_blizzards = new Map<string, Blizzard[]>();
  for (const pos_blizzards of blizzards.values()) {
    for (const blizzard of pos_blizzards) {
      moveBlizzard(blizzard);
      const blizzard_key = [blizzard.x, blizzard.y].join();
      if (!next_blizzards.has(blizzard_key))
        next_blizzards.set(blizzard_key, []);
      next_blizzards.get(blizzard_key)!.push(blizzard);
    }
  }
  blizzards = next_blizzards;
};


moveBlizzards();

let current_step = 0;
const navigateToDestination = (start: Position, end: Position) => {

  type Todo = {pos: Position, steps: number;};
  const todo = new Queue();
  todo.enqueue({pos: start, steps: current_step});

  const round_pos = new Set();

  const enqueuePos = (next: Todo) => {
    const new_pos_key = [next.pos.x, next.pos.y].join();
    if (
      walls.has(new_pos_key) ||
      blizzards.has(new_pos_key) ||
      round_pos.has(new_pos_key) ||
      next.pos.y < 0
    )
      return;
    round_pos.add(new_pos_key);
    todo.enqueue(next);

  };
  while (!todo.empty) {
    const {pos, steps} = todo.dequeue();
    if (pos.x == end.x && pos.y == end.y) {
      current_step = steps;
      console.log('End found!');
      break;
    }
    if (steps > current_step) {
      current_step = steps;
      moveBlizzards();
      round_pos.clear();
      console.log('steps', steps + 1);
    }
    enqueuePos({pos, steps: steps + 1});

    for (let dir = 0; dir < 4; dir++) {
      const new_pos = {...pos};
      switch (dir) {
        case 0:
          new_pos.x++;
          break;
        case 1:
          new_pos.y++;
          break;
        case 2:
          new_pos.x--;
          break;
        case 3:
          new_pos.y--;
          break;
      }
      enqueuePos({pos: new_pos, steps: steps + 1});
    }
  }

  return current_step;
};

console.log(navigateToDestination(start, end));
console.log(navigateToDestination(end, start));
console.log(navigateToDestination(start, end));
