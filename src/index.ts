import { parse } from 'acorn';
import { Node, QLC, QLCType } from './types';
import questions from './questions';

export { QLC, QLCType } from './types';

export const generate = (
  source: string,
  select?: QLCType[],
): { type: QLCType; qlcs: QLC[] }[] => {
  const ast = parse(source, { ecmaVersion: 2020, locations: true });
  const types = select
    ? questions.filter(({ type }) => select.includes(type))
    : questions;
  return types
    .map(({ type, prepare }) => ({ type, prepared: prepare(ast as Node) }))
    .filter(({ prepared }) => prepared.available)
    .map(({ type, prepared }) => ({ type, qlcs: prepared.generate() }));
};
