import { promises as fs } from 'fs';

const games = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(v => v)
  .map(line => line.split(' '));

// A for Rock, B for Paper, and C for Scissors.
const outcomePoints = outcome => {
  switch (outcome) {
    case 'X': // loss
      return 0;
    case 'Y': // tie
      return 3;
    case 'Z': // win
      return 6;
  }
};

const action_delta_map = {
  X: -1,
  Y: 0,
  Z: 1,
};
const figurePoints = (fig1, outcome) => {
  return (
    ((fig1.charCodeAt(0) - 'A'.charCodeAt(0) + action_delta_map[outcome] + 3) %
      3) +
    1
  );
};

const points = games
  //  .map(g => [g, outcomePoints(g[1]) + figurePoints.apply(null, g)])
  //  .forEach(g => console.log(g));
  .map(g => outcomePoints(g[1]) + figurePoints.apply(null, g))
  .reduce((acc, val) => acc + val, 0);
console.log(points);
