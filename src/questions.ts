import { Node } from 'shift-ast';
import { LocationMap } from 'shift-parser';
import { ArrayRequest, pickFrom, shuffle } from './arrays';
import { getParameterNames } from './getFunctions';
import { QLCOption, QLCTemplate } from './types';
import t from './i18n';
import { getKeywords } from './getKeywords';

const getLine = (node: Node, locations: LocationMap): number => {
  const r = locations.get(node);
  return r ? r.start.line : 0;
};

const buildOptions = (
  correct: string,
  ...distractors: ArrayRequest<string>[]
): QLCOption[] => {
  const opt = pickFrom([[correct]], ...distractors);
  return shuffle(
    [{ answer: correct, correct: true } as QLCOption].concat(
      opt.slice(1).map(answer => ({ answer })),
    ),
  );
};

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: ({ functions, locations }) =>
      (functions || []).map(({ name, astNode, variables }) => () => ({
        question:
          functions.length > 1
            ? t('q_function_name_line', getLine(astNode, locations))
            : t('q_function_name'),
        options: buildOptions(
          name,
          [astNode.type === 'FunctionDeclaration' ? ['function'] : []],
          [() => getParameterNames(astNode.params)],
          [() => variables.map(v => v.name), 4, true],
          [() => getKeywords(astNode), 5, true],
        ),
      })),
  },
];

export default questions;
