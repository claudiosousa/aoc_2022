import { promises as fs } from 'fs';

const monkeys_desc = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l);

let monkeys = [];
let i = 0;
while (i < monkeys_desc.length) {
  let monkey = [];
  monkey.push(
    monkeys_desc[i + 1]
      .split(':')[1]
      .split(',')
      .map(m => parseInt(m))
  );
  monkey.push(monkeys_desc[i + 2].split('=')[1]);
  monkey.push(parseInt(monkeys_desc[i + 3].split('by')[1]));
  monkey.push(parseInt(monkeys_desc[i + 4].split('monkey')[1]));
  monkey.push(parseInt(monkeys_desc[i + 5].split('monkey')[1]));
  monkey.push(0);
  monkeys.push(monkey);
  i += 6;
}

const cmm = monkeys.map(m => m[2]).reduce((a, b) => a * b);
for (let i = 0; i < 10000; i++) {
  for (let monkey of monkeys) {
    let items = monkey[0];
    let op = monkey[1];
    let test = monkey[2];
    let iftrue = monkey[3];
    let iffalse = monkey[4];
    monkey[5] += items.length;
    for (let item of items) {
      let old = item;
      let worry = eval(op);
      worry %= cmm;
      if (worry % test == 0) monkeys[iftrue][0].push(worry);
      else monkeys[iffalse][0].push(worry);
    }
    monkey[0] = [];
  }
}
console.log(
  monkeys
    .map(m => m[5])
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b)
);
