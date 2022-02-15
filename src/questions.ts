import { extractFunctionNaming } from './analysis';
import { Node, QLCTemplate } from './types';

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: (ast: Node) =>
      extractFunctionNaming(ast).map(({ fun, variables, keywords }) => () => ({
        type: 'FunctionName',
        question: 'Which is the name of the function?',
        options: [{ answer: fun, correct: true }],
      })),
  },
];

export default questions;
