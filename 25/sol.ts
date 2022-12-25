type SnafuDigit = -2 | -1 | 0 | 1 | 2;
type Snafu = SnafuDigit[];

const digits = {
  '2': 2,
  '1': 1,
  '0': 0,
  '=': -2,
  '-': -1
};

const values = (await Deno.readTextFile('./input.txt'))
  .split('\n')
  .filter(l => l)
  .map(l => l.split('').reverse().map(c => digits[c]));


const snafuToBase10 = (snafu: Snafu): number =>
  snafu.reduce((acc, digit, i) => acc + digit * Math.pow(5, i), 0);


const base10ToSnafu = (nb: number): Snafu => {
  if (nb == 0)
    return [];
  let s = 0;
  let i = 0;
  let digit: SnafuDigit = 0;
  while (s < Math.abs(nb)) {
    s += Math.pow(5, i);
    digit = 1;
    if (s < Math.abs(nb)) {
      s += Math.pow(5, i);
      digit = 2;
    }
    i++;
  }
  i--;
  let sub_snafu = base10ToSnafu(nb - (nb > 0 ? 1 : -1) * digit * Math.pow(5, i));
  return [...sub_snafu, ...[...new Array(i - sub_snafu.length)].map(() => 0), Math.sign(nb) * digit];
};


const total_fuel = values.map(v => snafuToBase10(v)).reduce((acc, v) => acc + v, 0);
console.log(total_fuel);

const snafuDigits = new Map([
  [2, '2'],
  [1, '1'],
  [0, '0'],
  [- 1, '-'],
  [-2, '=']
]);

console.log(base10ToSnafu(total_fuel).reverse().map(c => snafuDigits.get(c)).join(''));;
