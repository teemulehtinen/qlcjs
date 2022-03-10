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
  if (typeof v === 'number') {
    return v - 1;
  }
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) {
      return `${n - 1}`;
    }
    if (v.trim() !== v) {
      return v.trim();
    }
    return String.fromCharCode(...v.split('').map(c => c.charCodeAt(0) - 1));
  }
  if (typeof v === 'boolean') {
    return !v;
  }
  return v.slice(0, -1);
};

export const larger = (v: SimpleValue): SimpleValue => {
  if (typeof v === 'number') {
    return v + 1;
  }
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) {
      return `${n + 1}`;
    }
    return String.fromCharCode(...v.split('').map(c => c.charCodeAt(0) + 1));
  }
  if (typeof v === 'boolean') {
    return !v;
  }
  return v.slice(1);
};
