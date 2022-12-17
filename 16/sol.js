import { promises as fs } from 'fs';
import Queue from '../utils/queue.js';

let valves = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => {
    const matches = l.match(/Valve\s(..).*rate=([0-9]+).*valves?\s(.*)/);
    return [matches[1], parseInt(matches[2]), matches[3].split(', ')];
  })
  .reduce((acc, v) => acc.set(v[0], v.slice(1)), new Map());

let todo = new Queue();
todo.enqueue(['AA', 0, 30, new Set()]);
let done = new Set();
let max_pressure = 0;
while (!todo.empty) {
  let [valve, total_pressure, minutes, open] = todo.dequeue();
  if (minutes <= 1) continue;
  if (done.has(valve + total_pressure)) continue;
  done.add(valve + total_pressure);
  let [valve_pressure, children] = valves.get(valve);
  for (const child of children) {
    todo.enqueue([child, total_pressure, minutes - 1, open]);
  }
  if (!open.has(valve) && valve_pressure > 0) {
    total_pressure += valve_pressure * (minutes - 1);
    max_pressure = Math.max(max_pressure, total_pressure);
    let open_with_valve = new Set(open);
    open_with_valve.add(valve);
    todo.enqueue([valve, total_pressure, minutes - 1, open_with_valve]);
  }
}
console.log(max_pressure);
