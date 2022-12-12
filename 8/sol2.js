import { promises as fs } from 'fs';

const arr = (await fs.readFile('./input.txt', 'utf-8'))
  .toString()
  .split('\n')
  .filter(l => l)
  .map(l => l.split('').map(c => parseInt(c)));

const height = arr.length;
const width = arr[0].length;

let max_visible_height = 0;
for (let i = 0; i < height; i++) {
  for (let j = 0; j < width; j++) {
    let [top, left, right, bottom] = [0, 0, 0, 0];
    const tree_height = arr[i][j];
    for (let i2 = i - 1; i2 >= 0; i2--) {
      top++;
      if (arr[i2][j] >= tree_height) break;
    }
    for (let i2 = i + 1; i2 < height; i2++) {
      bottom++;
      if (arr[i2][j] >= tree_height) break;
    }
    for (let j2 = j - 1; j2 >= 0; j2--) {
      left++;
      if (arr[i][j2] >= tree_height) break;
    }
    for (let j2 = j + 1; j2 < width; j2++) {
      right++;
      if (arr[i][j2] >= tree_height) break;
    }

    max_visible_height = Math.max(
      max_visible_height,
      top * left * right * bottom
    );
  }
}

console.log(max_visible_height);
