import { promises as fs } from 'fs';

const games = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(v => v)
  .map(line => line.split(' '));

// A for Rock, B for Paper, and C for Scissors.
const wins_p2 = new Set(['AY', 'BZ', 'CX']);
const outcomePoints = (fig1, fig2) => {
  if (
    fig1.charCodeAt(0) - 'A'.charCodeAt(0) ==
    fig2.charCodeAt(0) - 'X'.charCodeAt(0)
  ) {
    return 3;
  }
  return wins_p2.has(fig1 + fig2) ? 6 : 0;
};

const figurePoints = figure => {
  return figure.charCodeAt(0) - 'W'.charCodeAt(0);
};

const points = games
  .map(g => outcomePoints.apply(null, g) + figurePoints(g[1]))
  // .forEach(g => console.log(g))
  .reduce((acc, val) => acc + val, 0);
console.log(points);
