import { extractNaming } from './analysis';
import { pick } from './arrays';
import { Node, QLCTemplate } from './types';

const questions: QLCTemplate[] = [
	{
		type: 'FunctionName',
		prepare: (ast: Node) => {
			const data = extractNaming(ast);
			return {
				available: data.functions.size > 0,
				generate: n =>
					pick(data.functions.values(), n).map(id => ({
						question: 'Which is the name of a function?',
						options: [{ answer: id, correct: true }],
					})),
			};
		},
	},
];

export default questions;
