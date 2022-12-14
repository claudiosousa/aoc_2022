import { promises as fs } from 'fs';
import PriorityQueue from 'priorityqueue';

let area = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split(''));

let start, end;
area.forEach((l, y) =>
  l.forEach((c, x) => {
    if (c == 'S') start = [x, y];
    if (c == 'E') end = [x, y];
  })
);
area[start[1]][start[0]] = 'a';
area[end[1]][end[0]] = 'z';
area = area.map(l => l.map(c => c.charCodeAt(0) - 'a'.charCodeAt(0)));

let navigated_area = area.map(l => l.map(c => Infinity));
navigated_area[start[1]][start[0]] = 0;
const valid_paths_queue = new PriorityQueue({
  comparator: (a, b) => b[1] - a[1],
});
valid_paths_queue.push([start, 0]);
let solution_cost = -1;

const isValidMove = ([x, y], cost, [dx, dy]) => {
  const x2 = x + dx;
  const y2 = y + dy;
  if (x2 < 0 || x2 >= area[0].length || y2 < 0 || y2 >= area.length)
    return null;
  if (navigated_area[y2][x2] <= cost + 1) return null;
  const hight = area[y][x];
  const hight2 = area[y2][x2];
  if (hight2 > hight + 1) return null;
  return [[x2, y2], cost + 1];
};

while (valid_paths_queue.length) {
  let [valid_path_xy, valid_path_cost] = valid_paths_queue.pop();
  if (valid_path_xy[0] == end[0] && valid_path_xy[1] == end[1]) {
    solution_cost = valid_path_cost;
    break;
  }
  [
    isValidMove(valid_path_xy, valid_path_cost, [-1, 0]),
    isValidMove(valid_path_xy, valid_path_cost, [1, 0]),
    isValidMove(valid_path_xy, valid_path_cost, [0, 1]),
    isValidMove(valid_path_xy, valid_path_cost, [0, -1]),
  ]
    .filter(m => m)
    .forEach(move => {
      valid_paths_queue.push(move);
      navigated_area[move[0][1]][move[0][0]] = move[1];
    });
}

console.log(solution_cost);
