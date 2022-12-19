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

const [WIDTH, SAMPLE_ROCKS, TOTAL_ROCKS] = [7, 10000, 1000000000000];

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
let prev_itop_row = 0;
let ijet = 0;
let max_height = 0;
const heights_and_jet_pos: { h: number; dh: number; j: number }[] = [];
const dropNewFigure = (r: number) => {
  if (screen.length < itop_row + 7) {
    screen = [
      ...screen,
      ...[...new Array(7)].map(() => [...new Array(WIDTH)].map(() => false)),
    ];
  }

  const figure = figures[r % figures.length];
  heights_and_jet_pos.push({
    h: itop_row,
    dh: itop_row - prev_itop_row,
    j: r % figures.length,
  });
  prev_itop_row = itop_row;
  ({ itop_row, ijet } = appendFigure(screen, figure, itop_row, ijet));
  itop_row = max_height = Math.max(max_height, itop_row);
};

for (let r = 0; r < SAMPLE_ROCKS; r++) {
  dropNewFigure(r);
}

const calculateRepeatingWindow = () => {
  for (
    let i = heights_and_jet_pos.length - 1 - 5;
    i >= (heights_and_jet_pos.length * 2) / 3;
    i -= 5
  ) {
    let match_found = true;
    for (let j = 0; j < heights_and_jet_pos.length - i; j++) {
      if (
        heights_and_jet_pos[i - j].dh !=
          heights_and_jet_pos[heights_and_jet_pos.length - 1 - j].dh ||
        heights_and_jet_pos[i - j].j !=
          heights_and_jet_pos[heights_and_jet_pos.length - 1 - j].j
      ) {
        match_found = false;
        break;
      }
    }
    if (match_found) {
      return {
        start: i,
        end: heights_and_jet_pos.length - 1,
        length: heights_and_jet_pos.length - 1 - i,
        h_delta:
          heights_and_jet_pos[heights_and_jet_pos.length - 1].h -
          heights_and_jet_pos[i].h,
      };
    }
  }
  return undefined;
};

const repeating_window = calculateRepeatingWindow();
if (!repeating_window) throw 'No repeating window found';

console.log(repeating_window);

const d_rocks = TOTAL_ROCKS - SAMPLE_ROCKS;
const missing_after_repeat = d_rocks % repeating_window.length;
for (let i = 0; i < missing_after_repeat; i++) {
  dropNewFigure(SAMPLE_ROCKS + i);
}
const repeats_in_window = Math.floor(d_rocks / repeating_window.length);
max_height += repeats_in_window * repeating_window.h_delta;
// console.log(
//   [...screen]
//     .reverse()
//     .map(l => l.map(c => (c ? '#' : '.')).join(''))
//     .join('\n')
// );
// console.log('_______');
console.log(max_height);
