import { promises as fs } from 'fs';
import Queue from '../utils/queue.js';

let valves_by_id = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => {
    const matches = l.match(/Valve\s(..).*rate=([0-9]+).*valves?\s(.*)/);
    return [matches[1], parseInt(matches[2]), matches[3].split(', ')];
  })
  .reduce((acc, v) => acc.set(v[0], v.slice(1)), new Map());

const valves_with_flow_rate = new Set(
  [...valves_by_id.keys()].filter(k => valves_by_id.get(k)[0] > 0)
);

let valves_with_flow_rate_by_id = new Map();
for (let start_valve of [...valves_with_flow_rate, 'AA']) {
  let todo = new Queue();
  todo.enqueue([start_valve, 0, new Set([start_valve])]);
  let start_valve_details = [valves_by_id.get(start_valve)[0], []];
  let seen_valves = new Set();
  valves_with_flow_rate_by_id.set(start_valve, start_valve_details);
  while (!todo.empty) {
    let [valve, dist, visited] = todo.dequeue();
    let [, children] = valves_by_id.get(valve);
    dist++;
    for (let child of children) {
      if (visited.has(child)) continue;
      let visited_with_child = new Set(visited);
      visited_with_child.add(child);
      if (valves_with_flow_rate.has(child) && !seen_valves.has(child)) {
        seen_valves.add(child);
        start_valve_details[1].push([child, dist]);
      }
      todo.enqueue([child, dist, visited_with_child]);
    }
  }
}

let todo = [];
let pressure_by_visited_nodes = new Map();
todo.push(['AA', 26, 0, new Set()]);

while (todo.length > 0) {
  let [valve, minutes, total_pressure, visited] = todo.pop();

  let [, children] = valves_with_flow_rate_by_id.get(valve);
  for (let [child, dist] of children) {
    if (minutes <= dist + 1) continue;
    if (visited.has(child)) continue;
    let next_visited = new Set(visited);
    next_visited.add(child);
    let [child_pressure] = valves_with_flow_rate_by_id.get(child);
    let child_total_pressure =
      total_pressure + child_pressure * (minutes - dist - 1);
    const done_key = [...next_visited].sort().join();
    if (pressure_by_visited_nodes.has(done_key)) {
      const prev = pressure_by_visited_nodes.get(done_key);
      prev.pressure = Math.max(prev.pressure, child_total_pressure);
    } else {
      pressure_by_visited_nodes.set(done_key, {
        visited: next_visited,
        pressure: child_total_pressure,
      });
    }
    todo.push([child, minutes - dist - 1, child_total_pressure, next_visited]);
  }
}

let max_pressure_both_paths = 0;
for (let [
  ,
  { visited: visited1, pressure: pressure1 },
] of pressure_by_visited_nodes) {
  let visited1_arr = [...visited1];
  for (let [
    ,
    { visited: visited2, pressure: pressure2 },
  ] of pressure_by_visited_nodes) {
    if (visited1_arr.some(v1 => visited2.has(v1))) continue;
    max_pressure_both_paths = Math.max(
      max_pressure_both_paths,
      pressure1 + pressure2
    );
  }
}

console.log(max_pressure_both_paths);
