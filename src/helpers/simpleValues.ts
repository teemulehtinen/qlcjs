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

export const formatSimpleList = (v: SimpleValue[]) =>
  v.map(simpleToProgram).join(', ');

export const smaller = (v: SimpleValue): SimpleValue => {
  switch (typeof v) {
    case 'number':
      return v - 1;
    case 'string':
      if (v.trim() !== v) {
        return v.trim();
      }
      return String.fromCharCode(...v.split('').map(c => c.charCodeAt(0) - 1));
    case 'boolean':
      return !v;
    default:
      return v.slice(0, -1);
  }
};

export const larger = (v: SimpleValue): SimpleValue => {
  switch (typeof v) {
    case 'number':
      return v + 1;
    case 'string':
      return String.fromCharCode(...v.split('').map(c => c.charCodeAt(0) + 1));
    case 'boolean':
      return !v;
    default:
      return v.slice(1);
  }
};

export const next = (vs: SimpleValue[]): SimpleValue => {
  if (vs.length < 2 || vs[vs.length - 1] < vs[vs.length - 2]) {
    return smaller(vs[vs.length - 1]);
  }
  return larger(vs[vs.length - 1]);
};
