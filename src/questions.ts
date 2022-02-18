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
  correct: string[],
  ...distractors: ArrayRequest<string>[]
): QLCOption[] => {
  const opt = pickFrom([correct], ...distractors);
  return shuffle(
    correct
      .map(answer => ({ answer, correct: true } as QLCOption))
      .concat(opt.slice(correct.length).map(answer => ({ answer }))),
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
          [name],
          [astNode.type === 'FunctionDeclaration' ? ['function'] : []],
          [getParameterNames(astNode.params)],
          [() => variables.map(v => v.name), 4, true],
          [() => getKeywords(astNode), 5, true],
        ),
      })),
  },
  {
    type: 'ParameterName',
    prepare: ({ functions, locations }) =>
      (functions || [])
        .map(data => ({
          ...data,
          params: getParameterNames(data.astNode.params),
        }))
        .filter(({ params }) => params.length > 0)
        .map(({ name, astNode, variables, params }) => () => ({
          question:
            functions.length > 1
              ? t('q_parameter_name_line', getLine(astNode, locations))
              : t('q_parameter_name'),
          options: buildOptions(
            params,
            [
              [name].concat(
                astNode.type === 'FunctionDeclaration' ? 'function' : [],
              ),
            ],
            [() => variables.map(v => v.name), 4, true],
            [() => getKeywords(astNode), 5, true],
          ),
        })),
  },
];

export default questions;
