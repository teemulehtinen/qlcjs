import { parse } from 'acorn';
import { Node, QLC, QLCPrepared, QLCRequest, QLCType } from './types';
import questions from './questions';

export { QLC, QLCType } from './types';

export const prepare = (source: string, select?: QLCType[]): QLCPrepared[] => {
  const ast = parse(source, { ecmaVersion: 2020, locations: true }) as Node;
  const templates = select
    ? questions.filter(({ type }) => select.includes(type))
    : questions;
  return templates
    .flatMap(({ type, prepare: prepareTemplate }) =>
      prepareTemplate(ast).map(generate => ({ type, generate })),
    )
    .map(({ type, generate }, key) => ({ key, generate, type }));
};

const includedTypes = (requests: QLCRequest[]): QLCType[] | undefined => {
  if (requests.find(req => req.types === undefined)) {
    return undefined;
  }
  return [...new Set(requests.flatMap(req => req.types || []))];
};

const select = (prepared: QLCPrepared[], types: QLCType[] | undefined) =>
  types ? prepared.filter(({ type }) => types.includes(type)) : prepared;

const pick = (selected: QLCPrepared[]) => {
  if (selected.length === 0) {
    return undefined;
  }
  return selected[Math.floor(Math.random() * selected.length)];
};

export const generate = (source: string, requests: QLCRequest[]): QLC[] => {
  let prepared = prepare(source, includedTypes(requests));
  const out: QLC[] = [];
  requests.forEach(({ count, fill, types, uniqueTypes }) => {
    let targetCount = fill ? count - out.length : count;
    while (targetCount > 0 && prepared.length > 0) {
      const picked = pick(select(prepared, types));
      if (picked) {
        out.push({ type: picked.type, ...picked.generate() });
        if (uniqueTypes) {
          prepared = prepared.filter(({ type }) => type !== picked.type);
        } else {
          prepared = prepared.filter(({ key }) => key !== picked.key);
        }
      }
      targetCount -= 1;
    }
  });
  return out;
};
