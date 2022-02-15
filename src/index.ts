import { parse } from 'acorn';
import { Node, QLC, QLCType } from './types';
import questions from './questions';

export { QLC, QLCType } from './types';

export const generate = (
	source: string,
	select?: QLCType[],
): { type: QLCType; qlcs: QLC[] }[] => {
	const ast = parse(source, { ecmaVersion: 2020, locations: true }) as Node;
	const types = select
		? questions.filter(({ type }) => select.includes(type))
		: questions;
	return types
		.map(({ type, prepare }) => ({ type, prepared: prepare(ast) }))
		.filter(({ prepared }) => prepared.available)
		.map(({ type, prepared }) => ({ type, qlcs: prepared.generate() }));
};
