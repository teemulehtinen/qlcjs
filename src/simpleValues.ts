export type SimpleValue =
  | boolean
  | number
  | string
  | boolean[]
  | number[]
  | string[];

const isSingle = (v: SimpleValue): v is boolean | number | string =>
  !Array.isArray(v);

const toProgram = (v: boolean | number | string) =>
  typeof v === 'string' ? `"${v}"` : `${v}`;

export const simpleToProgram = (v: SimpleValue): string => {
  if (isSingle(v)) {
    return toProgram(v);
  }
  return `[${v.map(e => toProgram(e)).join(', ')}]`;
};
