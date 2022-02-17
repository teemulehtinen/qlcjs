export const asArray = <T>(input: T | T[]): T[] =>
  Array.isArray(input) ? input : [input];

export const shuffle = <T>(input: T[]): T[] =>
  input
    .map((element): [T, number] => [element, Math.random()])
    .sort((pairA, pairB) => pairA[1] - pairB[1])
    .map(pair => pair[0]);

export const pick = <T>(input: T[], n?: number): T[] =>
  shuffle(input).slice(0, n || 1);

type ArrayRequest<T> = [T[], number, boolean?];

export const pickFrom = <T>(...requests: ArrayRequest<T>[]): T[] => {
  const out: T[] = [];
  requests.forEach(req => {
    out.push(...pick(req[0], req[2] ? req[1] - out.length : req[1]));
  });
  return out;
};

type SetRequest<T> = [Set<T>, number, boolean?];

export const pickFromSets = <T>(...requests: SetRequest<T>[]): T[] =>
  pickFrom(
    ...requests.map((r): ArrayRequest<T> => [[...r[0].values()], r[1], r[2]]),
  );
