export const asArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input];

export const shuffle = <T>(input: T[]): T[] =>
  input
    .map((element): [T, number] => [element, Math.random()])
    .sort((pairA, pairB) => pairA[1] - pairB[1])
    .map(pair => pair[0]);

export const pick = <T>(input: T[], n?: number): T[] =>
  shuffle(input).slice(0, n);

export const pickIndex = <T>(input: T[]): number =>
  Math.floor(Math.random() * input.length);

export const pickOne = <T>(input: T[]): T => input[pickIndex(input)];

export const notIn = <T>(input: T[], not: T[]): T[] =>
  input.filter(e => !not.includes(e));

export type ArrayRequest<T> = [T[] | (() => T[]), number?, boolean?];

export const pickFrom = <T>(...requests: ArrayRequest<T>[]): T[] =>
  requests.reduce((out, [reserve, n, fill]) => {
    if (n !== undefined && fill && out.length >= n) {
      return out;
    }
    const data = notIn(
      [...new Set(typeof reserve === 'function' ? reserve() : reserve)],
      out,
    );
    if (n === undefined) {
      return out.concat(data);
    }
    return out.concat(pick(data, fill ? n - out.length : n));
  }, new Array<T>());

export const sortNumberOrString = (
  a: number | string,
  b: number | string,
): number => {
  if (typeof a === 'number' && typeof b === 'string') {
    return -1;
  }
  if (typeof a === 'string' && typeof b === 'number') {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
