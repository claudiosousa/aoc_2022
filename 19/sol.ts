const blueprints = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map(l =>
    [
      ...l.match(
        /(\d+) ore.*(\d+) ore.*(\d+) ore and (\d+) clay.*(\d+) ore and (\d+) obsidian/
      )!,
    ]
      .slice(1)
      .map(c => parseInt(c))
  )
  .map(v => [
    [v[0], 0, 0],
    [v[1], 0, 0],
    [v[2], v[3], 0],
    [v[4], 0, v[5]],
  ]);

let total_quality = 0;
for (let iblueprint = 0; iblueprint < blueprints.length; iblueprint++) {
  const blueprint = blueprints[iblueprint];
  console.log('========================', iblueprint, blueprint);
  const todo = [
    {
      resources: [0, 0, 0, 0],
      robots: [1, 0, 0, 0],
      minutes: 24,
      next_robot: 0,
    },
    {
      resources: [0, 0, 0, 0],
      robots: [1, 0, 0, 0],
      minutes: 24,
      next_robot: 1,
    },
  ];
  let max_quality = 0;
  while (todo.length > 0) {
    const state = todo.pop()!;
    if (state.minutes == 0) {
      const state_max_quality = Math.max(
        max_quality,
        state.resources[3] * (iblueprint + 1)
      );
      if (state_max_quality > max_quality) {
        max_quality = state_max_quality;
        console.log(max_quality, state);
        //prompt();
      }
      continue;
    }
    const next_resources = [...state.resources];
    // Can buy next robot?
    if (blueprint[state.next_robot].every((c, i) => c <= state.resources[i])) {
      // Buy next robot
      const next_robots = [...state.robots];
      next_robots[state.next_robot]++;
      for (let i = 0; i < 3; i++)
        next_resources[i] -= blueprint[state.next_robot][i];
      // Harvest resources
      for (let i = 0; i < 4; i++) next_resources[i] += state.robots[i];
      // Buy each robot later
      for (let i = Math.max(state.next_robot - 1, 0); i < 4; i++)
        //for (let i = 0; i < 4; i++)
        todo.push({
          resources: next_resources,
          robots: next_robots,
          minutes: state.minutes - 1,
          next_robot: i,
        });
    } else {
      // Harvest resources
      for (let i = 0; i < 4; i++) next_resources[i] += state.robots[i];
      // try buy robot later
      todo.push({
        resources: next_resources,
        robots: state.robots,
        minutes: state.minutes - 1,
        next_robot: state.next_robot,
      });
    }
  }
  total_quality += max_quality;
}

console.log(total_quality);
