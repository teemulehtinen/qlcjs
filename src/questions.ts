import { Node } from 'shift-ast';
import { LocationMap } from 'shift-parser';
import { QLCOption, QLCTemplate } from './types';
import { ArrayRequest, pickFrom, pickIndex, pickOne, shuffle } from './arrays';
import { getParameterNames } from './getFunctions';
import { getKeywords } from './getKeywords';
import { literalValues } from './travelTrees';
import { simpleToProgram } from './simpleValues';
import t from './i18n';

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
  {
    type: 'ParameterValue',
    prepare: ({ functions, inputs }) =>
      (functions || [])
        .map(data => ({
          ...data,
          params: getParameterNames(data.astNode.params),
          finputs:
            inputs.find(i => i.functionName === data.name)?.parameters || [],
        }))
        .filter(
          ({ params, finputs }) => params.length > 0 && finputs.length > 0,
        )
        .map(({ name, astNode, params, finputs }) => () => {
          const i = pickIndex(params) || 0;
          const p = (pickOne(finputs) || []).map(simpleToProgram);
          return {
            question: t(
              'q_parameter_value',
              params[i],
              `${name}(${p.join(', ')})`,
            ),
            options: buildOptions(
              [p[i]],
              [p],
              [() => literalValues(astNode).map(simpleToProgram), 3, true],
              [() => finputs.map(d => simpleToProgram(d[i])), 5, true],
            ),
          };
        }),
  },
];

export default questions;
