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

console.log(getMonkeyValue('root'));
