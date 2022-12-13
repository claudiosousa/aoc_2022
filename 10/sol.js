import { promises as fs } from 'fs';

const instrs = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split(' '))
  .map(([cmd, arg]) => (cmd == 'addx' ? [cmd, parseInt(arg)] : [cmd]));

let cycle = 1;
let xreg = 1;
let signal_strength = 0;
const check_if_signal_change = () => {
  if (cycle == 20 || (cycle - 20) % 40 == 0) {
    signal_strength += cycle * xreg;
    //console.log(cycle, xreg, signal_strength);
  }
};

instrs.forEach(([cmd, arg]) => {
  cycle++;
  check_if_signal_change();
  if (cmd == 'addx') {
    cycle++;
    xreg += arg;
    check_if_signal_change();
  }
});

console.log(signal_strength);
