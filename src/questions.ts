import { Node } from 'shift-ast';
import { LocationMap } from 'shift-parser';
import { QLCOption, QLCTemplate } from './types';
import { simpleToProgram } from './simpleValues';
import {
  ArrayRequest,
  pickFrom,
  pickIndex,
  pickOne,
  sortNumberOrString,
} from './arrays';
import { getParameterNames } from './getFunctions';
import { getKeywords } from './getKeywords';
import { loopNodes, literalValues, lastBlockNode } from './travelTrees';
import t from './i18n';

const getLine = (node: Node, locations: LocationMap, end?: boolean): number => {
  const r = locations.get(node);
  if (end) {
    return r ? r.end.line : 0;
  }
  return r ? r.start.line : 0;
};

const buildOptions = (
  correct: (string | number)[],
  ...distractors: ArrayRequest<string | number>[]
): QLCOption[] => {
  const opt = pickFrom([correct], ...distractors);
  return correct
    .map(answer => ({ answer, correct: true } as QLCOption))
    .concat(opt.slice(correct.length).map(answer => ({ answer })))
    .sort((a, b) => sortNumberOrString(a.answer, b.answer));
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
          const paramIndex = pickIndex(params) || 0;
          const inputParams = (pickOne(finputs) || []).map(simpleToProgram);
          return {
            question: t(
              'q_parameter_value',
              params[paramIndex],
              `${name}(${inputParams.join(', ')})`,
            ),
            options: buildOptions(
              [inputParams[paramIndex]],
              [inputParams],
              [() => literalValues(astNode).map(simpleToProgram), 3, true],
              [() => finputs.map(d => simpleToProgram(d[paramIndex])), 5, true],
            ),
          };
        }),
  },
  {
    type: 'LoopEnd',
    prepare: ({ tree, locations }) =>
      loopNodes(tree).map(loop => () => {
        const beg = getLine(loop, locations);
        const end = getLine(lastBlockNode(loop.body), locations, true);
        const lines = [...Array(end - beg + 1).keys()]
          .map(i => beg - 1 + i)
          .concat(end + 2);
        return {
          question: t('q_loop_end', beg),
          options: buildOptions([end], [lines, 8, true]),
        };
      }),
  },
];

export default questions;
