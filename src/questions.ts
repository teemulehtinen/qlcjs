import { extractFunctionNaming } from './analysis';
import { pickFromSets, shuffle } from './arrays';
import { Node, QLCTemplate } from './types';

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: (ast: Node) =>
      extractFunctionNaming(ast).map(
        ({ fun, parameters, variables, keywords }) =>
          () => ({
            type: 'FunctionName',
            question: 'Which is the name of the function?',
            options: shuffle(
              [{ answer: fun, correct: true }, { answer: 'function' }].concat(
                pickFromSets<string>(
                  [parameters, 1],
                  [variables, 4, true],
                  [keywords, 5, true],
                ).map(answer => ({ answer })),
              ),
            ),
          }),
      ),
  },
];

export default questions;
