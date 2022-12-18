const jets: ('<' | '>')[] = <('<' | '>')[]>(
  await Deno.readTextFile('./input.txt')
)
  .split('\n')
  .filter(l => l)
  .flatMap(l => l.split(''));

type Figure = boolean[][];
const figures: Figure[] = [
  `
####`,
  `
 #
###
 #`,
  `
  #
  #
###`,
  `
#
#
#
#`,
  `
##
##`,
].map(f =>
  f
    .substring(1)
    .split('\n')
    .map(l => l.split('').map(c => c == '#'))
);

const [WIDTH, TOTAL_ROCKS] = [7, 2022];

const canMoveFigureSide = (
  screen: boolean[][],
  figure: Figure,
  { x, y }: { x: number; y: number },
  side: '<' | '>'
): boolean => {
  for (let i = 0; i < figure.length; i++) {
    if (side == '<') {
      for (let j = 0; j < figure[i].length; j++) {
        if (!figure[i][j]) continue;
        if (x + j == 0) return false;
        if (screen[y - i][x + j - 1]) return false;
        break;
      }
    } else {
      for (let j = figure[i].length - 1; j >= 0; j--) {
        if (!figure[i][j]) continue;
        if (x + j == WIDTH - 1) return false;
        if (screen[y - i][x + j + 1]) return false;
        break;
      }
    }
  }
  return true;
};

const canMoveFigureDown = (
  screen: boolean[][],
  figure: Figure,
  { x, y }: { x: number; y: number }
): boolean => {
  for (let j = 0; j < WIDTH; j++) {
    for (let i = figure.length - 1; i >= 0; i--) {
      if (j >= figure[i].length) continue;
      if (!figure[i][j]) continue;
      if (y - i == 0) return false;
      if (screen[y - i - 1][x + j]) return false;
    }
  }
  return true;
};

const appendFigure = (
  screen: boolean[][],
  figure: Figure,
  itop_row: number,
  ijet: number
): { itop_row: number; ijet: number } => {
  let [x, y] = [2, itop_row + 3 + figure.length];
  do {
    y--;
    if (canMoveFigureSide(screen, figure, { x, y }, jets[ijet])) {
      x += jets[ijet] == '<' ? -1 : 1;
    }
    ijet = (ijet + 1) % jets.length;
  } while (canMoveFigureDown(screen, figure, { x, y }));

  // add figure to screen
  for (let i = 0; i < figure.length; i++) {
    for (let j = 0; j < figure[i].length; j++) {
      if (figure[i][j]) screen[y - i][x + j] = true;
    }
  }
  return { itop_row: y + 1, ijet };
};

let screen: boolean[][] = [];
let itop_row = 0;
let ijet = 0;
let max_height = 0;
for (let r = 0; r < TOTAL_ROCKS; r++) {
  if (screen.length < itop_row + 7) {
    screen = [
      ...screen,
      ...[...new Array(7)].map(() => [...new Array(WIDTH)].map(() => false)),
    ];
  }
  const figure = figures[r % figures.length];
  ({ itop_row, ijet } = appendFigure(screen, figure, itop_row, ijet));
  itop_row = max_height = Math.max(max_height, itop_row);
}
console.log(
  [...screen]
    .reverse()
    .map(l => l.map(c => (c ? '#' : '.')).join(''))
    .join('\n')
);
console.log('_______');
console.log(max_height);
