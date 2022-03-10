import { QLCPrepararer } from '../types';
import { literalValues } from '../analysis/select';
import { getParameterNames } from '../analysis/getFunctions';
import { getKeywords } from '../analysis/getKeywords';
import { getLine } from '../analysis/getLine';
import { pickOptions, options, fillRandomOptions } from './options';
import { simpleToProgram } from '../helpers/simpleValues';
import { pickIndex, pickOne } from '../helpers/arrays';
import t from '../i18n';

export const functionName: QLCPrepararer = ({ functions, locations }) => {
  if (functions === undefined) {
    return [];
  }
  return functions.map(({ name, astNode, variables }) => () => ({
    question:
      functions.length > 1
        ? t('q_function_name_line', getLine(astNode, locations))
        : t('q_function_name'),
    options: pickOptions(
      options(name, 'function_name', t('o_function_correct'), true),
      astNode.type === 'FunctionDeclaration'
        ? options('function', 'keyword', t('o_function_function'))
        : undefined,
      options(
        getParameterNames(astNode.params),
        'parameter_name',
        t('o_function_parameter'),
      ),
      fillRandomOptions(
        4,
        () => variables.map(v => v.name),
        'variable_name',
        t('o_function_variable'),
      ),
      fillRandomOptions(
        5,
        () => getKeywords(astNode),
        'keyword',
        t('o_function_keyword'),
      ),
    ),
  }));
};

export const parameterName: QLCPrepararer = ({ functions, locations }) => {
  if (functions === undefined) {
    return [];
  }
  return functions
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
      options: pickOptions(
        options(
          params,
          'parameter_name',
          t('o_parameter_correct', params.length),
          true,
        ),
        options(name, 'function_name', t('o_parameter_function_name')),
        astNode.type === 'FunctionDeclaration'
          ? options('function', 'keyword', t('o_function_function'))
          : undefined,
        fillRandomOptions(
          4,
          () => variables.map(v => v.name),
          'variable_name',
          t('o_function_variable'),
        ),
        fillRandomOptions(
          5,
          () => getKeywords(astNode),
          'keyword',
          t('o_function_keyword'),
        ),
      ),
    }));
};

export const parameterValue: QLCPrepararer = ({ functions, input }) => {
  if (functions === undefined || input === undefined) {
    return [];
  }
  return functions
    .map(data => ({
      ...data,
      params: getParameterNames(data.astNode.params),
      argOpt: input.functionName === data.name ? input.arguments : [],
    }))
    .filter(({ params, argOpt }) => params.length > 0 && argOpt.length > 0)
    .map(({ name, astNode, params, argOpt }) => () => {
      const paramIndex = pickIndex(params) || 0;
      const args = (pickOne(argOpt) || []).map(simpleToProgram);
      return {
        question: t(
          'q_parameter_value',
          params[paramIndex],
          `${name}(${args.join(', ')})`,
        ),
        options: pickOptions(
          options(
            args[paramIndex],
            'parameter_value',
            t('o_parameter_value_correct'),
            true,
          ),
          options(args, 'wrong_parameter_value', t('o_parameter_value_other')),
          options(
            params[paramIndex],
            'parameter_name',
            t('o_function_parameter'),
          ),
          fillRandomOptions(
            3,
            () => literalValues(astNode).map(simpleToProgram),
            'literal',
            t('o_function_literal'),
          ),
          fillRandomOptions(
            5,
            () => argOpt.map(d => simpleToProgram(d[paramIndex])),
            'random_value',
            t('o_parameter_value_random'),
          ),
        ),
      };
    });
};
