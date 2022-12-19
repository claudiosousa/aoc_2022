const cubes = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .reduce(
    (acc, v: string) =>
      acc.set(
        v,
        v.split(',').map(c => parseInt(c))
      ),
    new Map<string, number[]>()
  );

const space = [...cubes.values()].reduce(
  (acc, c) => ({
    x: [Math.min(acc.x[0], c[0] - 1), Math.max(acc.x[1], c[0] + 1)],
    y: [Math.min(acc.y[0], c[1] - 1), Math.max(acc.y[1], c[1] + 1)],
    z: [Math.min(acc.z[0], c[2] - 1), Math.max(acc.z[1], c[2] + 1)],
  }),
  {
    x: [Infinity, -Infinity],
    y: [Infinity, -Infinity],
    z: [Infinity, -Infinity],
  }
);

const neighbours = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];

const checked = new Set();
const spaces_to_check = [[space.x[0], space.y[0], space.z[0]]];
let external_faces = 0;
while (spaces_to_check.length > 0) {
  const [x, y, z] = <number[]>spaces_to_check.pop();
  for (const neighbour_delta of neighbours) {
    const neighbour = [
      x + neighbour_delta[0],
      y + neighbour_delta[1],
      z + neighbour_delta[2],
    ];
    if (
      !(
        neighbour[0] >= space.x[0] &&
        neighbour[0] <= space.x[1] &&
        neighbour[1] >= space.y[0] &&
        neighbour[1] <= space.y[1] &&
        neighbour[2] >= space.z[0] &&
        neighbour[2] <= space.z[1]
      )
    )
      continue;
    const neighbour_str = neighbour.join();
    if (cubes.has(neighbour_str)) external_faces++;
    else if (!checked.has(neighbour_str)) {
      checked.add(neighbour_str);
      spaces_to_check.push(neighbour);
    }
  }
}
console.log(external_faces);
