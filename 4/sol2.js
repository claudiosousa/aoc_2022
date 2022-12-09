import { promises as fs } from 'fs';

const overlaps = (elf1, elf2) => elf1[1] >= elf2[0] && elf1[0] <= elf2[1];

const overlaps_count = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(line => line.split(','))
  .map(pair => {
    const [elf1, elf2] = pair.map(r => r.split('-').map(n => parseInt(n)));
    return overlaps(elf1, elf2) || overlaps(elf2, elf1);
  })
  .reduce((acc, overlap) => acc + overlap, 0);

console.log(overlaps_count);
