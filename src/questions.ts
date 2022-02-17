import { getFunctionsWithVariables } from './getFunctions';
import { pickFrom, shuffle } from './arrays';
import { QLCTemplate } from './types';

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: ({ scope, tree }) => {
      const fun = getFunctionsWithVariables(scope, tree);
      console.log(fun);
      return [].map(() => () => ({
        type: 'FunctionName',
        question: 'Which is the name of the function?',
        options: shuffle(
          [{ answer: 'x', correct: true }, { answer: 'function' }].concat(
            pickFrom<string>([[], 1], [[], 4, true], [[], 5, true]).map(
              answer => ({ answer }),
            ),
          ),
        ),
      }));
    },
  },
];

export default questions;
