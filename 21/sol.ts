type Expression = { left: string; op: '*' | '/' | '-' | '+'; right: string };

const monkeys: Map<string, Expression | number> = (
  await Deno.readTextFile('./input.txt')
)
  .split('\n')
  .filter(l => l)
  .map(l => l.match(/([a-z]{4}): (?:(?:([a-z]{4}) (.) ([a-z]{4}))|([0-9]+))/)!)
  .map(vs => [vs[1], vs[5] === undefined ? vs.slice(2, 5) : vs[5]])
  .reduce(
    (acc, m) =>
      acc.set(
        m[0],
        Array.isArray(m[1])
          ? { left: m[1][0], op: m[1][1], right: m[1][2] }
          : parseInt(m[1])
      ),
    new Map()
  );

const getMonkeyValue = (monkey_name: string): number => {
  const monkey = monkeys.get(monkey_name)!;
  if (typeof monkey == 'number') return monkey;
  const lvalue = getMonkeyValue(monkey.left);
  const rvalue = getMonkeyValue(monkey.right);
  switch (monkey.op) {
    case '*':
      return lvalue * rvalue;
    case '/':
      return lvalue / rvalue;
    case '-':
      return lvalue - rvalue;
    case '+':
      return lvalue + rvalue;
  }
};

const humain_monkey_name = 'humn';
const left_monkey_name = (<Expression>monkeys.get('root')).left;
const right_monkey_name = (<Expression>monkeys.get('root')).right;
const target_value = getMonkeyValue(right_monkey_name);

const getTreeValueForHValue = (hvalue: number): number => {
  monkeys.set(humain_monkey_name, hvalue);
  return getMonkeyValue(left_monkey_name);
};
const bsearch = (): number => {
  let l = 1,
    r = 2;
  while (getTreeValueForHValue(r) > target_value) {
    l = r;
    r *= 2;
  }

  do {
    const c = Math.floor(l + (r - l) / 2);
    const mval = getTreeValueForHValue(c);
    if (mval == target_value) return c;
    if (mval > target_value) l = c;
    else r = c - 1;
  } while (l < r);
  return r;
};

console.log(bsearch());
