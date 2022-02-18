export const asArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input];

export const shuffle = <T>(input: T[]): T[] =>
  input
    .map((element): [T, number] => [element, Math.random()])
    .sort((pairA, pairB) => pairA[1] - pairB[1])
    .map(pair => pair[0]);

export const pick = <T>(input: T[], n?: number): T[] =>
  shuffle(input).slice(0, n || 1);

export const notIn = <T>(input: T[], not: T[]): T[] =>
  input.filter(e => !not.includes(e));

export type ArrayRequest<T> = [T[] | (() => T[]), number?, boolean?];

export const pickFrom = <T>(...requests: ArrayRequest<T>[]): T[] =>
  requests.reduce((out, [reserve, n, fill]) => {
    if (n !== undefined && fill && out.length >= n) {
      return out;
    }
    const data = typeof reserve === 'function' ? reserve() : reserve;
    if (n === undefined) {
      return out.concat(data);
    }
    return out.concat(
      pick(notIn([...new Set(data)], out), fill ? n - out.length : n),
    );
  }, new Array<T>());
