const numbers = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map(c => parseInt(c));

const nb_count = numbers.length;
const indeces = [...new Array(nb_count)].map((_, i) => i);

const wrapAroundNumberList = (idx: number) => idx % (nb_count - 1);

const moveNb = (arr: number[], mixed_idx: number, dest_idx: number) => {
  const removed = arr.splice(mixed_idx, 1)[0];
  arr.splice(dest_idx, 0, removed);
};

let current_idx = 0;
for (let i = 0; i < nb_count; i++) {
  current_idx = Math.max(0, current_idx - 1);
  while (indeces[current_idx] != i) current_idx++;
  const nb = numbers[current_idx];
  const dest_idx = wrapAroundNumberList(current_idx + nb);
  moveNb(numbers, current_idx, dest_idx);
  moveNb(indeces, current_idx, dest_idx);
}

const zero_idx = numbers.findIndex(c => c == 0);
const n1000 = (zero_idx + 1000) % nb_count,
  n2000 = (zero_idx + 2000) % nb_count,
  n3000 = (zero_idx + 3000) % nb_count;
console.log(
  [n1000, n2000, n3000].map(n => numbers[n]).reduce((acc, v) => acc + v, 0)
);
