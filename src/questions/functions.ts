import { QLCPrepararer } from '../types';
import { simpleToProgram } from '../helpers/simpleValues';
import { pickIndex, pickOne } from '../helpers/arrays';
import { literalValues } from '../analysis/travelTrees';
import { getParameterNames } from '../analysis/getFunctions';
import { getKeywords } from '../analysis/getKeywords';
import { getLine } from '../analysis/getLine';
import { pickOptions, options, fillRandomOptions } from './options';
import t from '../i18n';

export const functionName: QLCPrepararer = ({ functions, locations }) =>
  (functions || []).map(({ name, astNode, variables }) => () => ({
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

export const parameterName: QLCPrepararer = ({ functions, locations }) =>
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

export const parameterValue: QLCPrepararer = ({ functions, inputs }) =>
  (functions || [])
    .map(data => ({
      ...data,
      params: getParameterNames(data.astNode.params),
      finputs: inputs.find(i => i.functionName === data.name)?.parameters || [],
    }))
    .filter(({ params, finputs }) => params.length > 0 && finputs.length > 0)
    .map(({ name, astNode, params, finputs }) => () => {
      const paramIndex = pickIndex(params) || 0;
      const inputParams = (pickOne(finputs) || []).map(simpleToProgram);
      return {
        question: t(
          'q_parameter_value',
          params[paramIndex],
          `${name}(${inputParams.join(', ')})`,
        ),
        options: pickOptions(
          options(
            inputParams[paramIndex],
            'parameter_value',
            t('o_parameter_value_correct'),
            true,
          ),
          options(
            inputParams,
            'wrong_parameter_value',
            t('o_parameter_value_incorrect'),
          ),
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
            () => finputs.map(d => simpleToProgram(d[paramIndex])),
            t('o_parameter_value_random'),
          ),
        ),
      };
    });
