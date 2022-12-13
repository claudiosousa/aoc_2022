import { promises as fs } from 'fs';

const instrs = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split(' '))
  .map(([cmd, arg]) => (cmd == 'addx' ? [cmd, parseInt(arg)] : [cmd]));

let screen = [...new Array(6)].map(() => [...new Array(40)].map(() => false));
let cycle = 1;
let xreg = 1;

const paintScreen = (screen, cycle, xreg) => {
  const [py, px] = [Math.floor((cycle - 1) / 40), (cycle - 1) % 40];
  screen[py][px] = Math.abs(px - xreg) <= 1;
};

instrs.reduce(
  ([screen, cycle, xreg], [cmd, arg]) => {
    paintScreen(screen, cycle, xreg);
    cycle++;
    if (cmd == 'addx') {
      paintScreen(screen, cycle, xreg);
      cycle++;
      xreg += arg;
    }
    return [screen, cycle, xreg];
  },
  [screen, cycle, xreg]
);

console.log(screen.map(l => l.map(c => (c ? '█' : '░')).join('')).join('\n'));
