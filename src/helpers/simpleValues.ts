export type SimpleValue =
  | boolean
  | number
  | string
  | boolean[]
  | number[]
  | string[];

const isSingle = (v: SimpleValue): v is boolean | number | string =>
  !Array.isArray(v);

const toProgram = (v: boolean | number | string): number | string => {
  if (typeof v === 'number') {
    return v;
  }
  return typeof v === 'string' ? `"${v}"` : `${v}`;
};

export const simpleToProgram = (v: SimpleValue): string | number =>
  isSingle(v) ? toProgram(v) : `[${v.map(e => toProgram(e)).join(', ')}]`;
