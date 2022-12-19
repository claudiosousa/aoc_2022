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

const neighbours = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];

let external_faces = 0;
for (const [, cube_arr] of cubes.entries()) {
  for (const neighbour_delta of neighbours) {
    const neighbour = [
      cube_arr[0] + neighbour_delta[0],
      cube_arr[1] + neighbour_delta[1],
      cube_arr[2] + neighbour_delta[2],
    ].join();
    if (!cubes.has(neighbour)) external_faces++;
  }
}

console.log(external_faces);
