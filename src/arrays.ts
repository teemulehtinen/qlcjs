export const shuffle = <T>(input: T[]): T[] =>
  input
    .map((element): [T, number] => [element, Math.random()])
    .sort((pairA, pairB) => pairA[1] - pairB[1])
    .map(pair => pair[0]);

export const pick = <T>(input: T[], n?: number): T[] =>
  shuffle(input).slice(0, n || 1);
