const numbers = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map(c => parseInt(c) * 811589153);

const nb_count = numbers.length;
const indeces = [...new Array(nb_count)].map((_, i) => i);

const wrapAroundNumberList = (idx: number) => idx % (nb_count - 1);

const moveNb = (arr: number[], mixed_idx: number, dest_idx: number) => {
  const removed = arr.splice(mixed_idx, 1)[0];
  arr.splice(dest_idx, 0, removed);
};

for (let k = 0; k < 10; k++) {
  for (let i = 0; i < nb_count; i++) {
    const mixed_idx = indeces.findIndex(v => v == i);
    const nb = numbers[mixed_idx];
    const dest_idx = wrapAroundNumberList(mixed_idx + nb);
    moveNb(numbers, mixed_idx, dest_idx);
    moveNb(indeces, mixed_idx, dest_idx);
  }
}

const zero_idx = numbers.findIndex(c => c == 0);
const n1000 = (zero_idx + 1000) % nb_count,
  n2000 = (zero_idx + 2000) % nb_count,
  n3000 = (zero_idx + 3000) % nb_count;
console.log([n1000, n2000, n3000].map(n => numbers[n]));
console.log(
  [n1000, n2000, n3000].map(n => numbers[n]).reduce((acc, v) => acc + v, 0)
);
