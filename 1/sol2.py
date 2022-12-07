from functools import reduce

with open('./input.txt') as file:
    lines = [line.strip() for line in file]

numbers = [None if line == '' else int(line) for line in lines]


def sum_calories(acc, v):
    if v is None:
      acc.append(0)
    else:
      acc[- 1] += v
    return acc


calories_per_person = reduce(sum_calories, numbers, [0])
print(reduce(lambda a, b: a+b, sorted(calories_per_person)[-3:]))
