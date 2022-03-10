import { QLCPrepararer } from '../types';
import { options, pickOptions } from './options';
import { formatSimpleList, larger, smaller } from '../helpers/simpleValues';
import { last, shuffle } from '../helpers/arrays';
import t from '../i18n';

export const variableTrace: QLCPrepararer = ({ input, recorded }) => {
  if (input === undefined || recorded === undefined) {
    return [];
  }
  return recorded.variables.map(({ index, name }) => () => {
    const vals = recorded.history[`${index}_${name}`];
    return {
      question: t(
        'q_variable_trace',
        name,
        `${input.functionName}(${formatSimpleList(recorded.arguments)})`,
      ),
      options: pickOptions(
        options(formatSimpleList(vals), 'trace', t('o_trace_correct'), true),
        [
          vals.length > 1
            ? [
                {
                  type: 'trace_miss_first',
                  answer: formatSimpleList(vals.slice(1)),
                  info: t('o_trace_miss'),
                },
                {
                  type: 'trace_miss_last',
                  answer: formatSimpleList(vals.slice(0, -1)),
                  info: t('o_trace_miss'),
                },
                {
                  type: 'trace_extra_last',
                  answer: formatSimpleList(vals.concat(smaller(last(vals)))),
                  info: t('o_trace_extra'),
                },
                {
                  type: 'trace_shuffled',
                  answer: formatSimpleList(shuffle(vals)),
                  info: t('o_trace_random'),
                },
              ]
            : [
                {
                  type: 'trace_smaller',
                  answer: formatSimpleList(vals.map(smaller)),
                  info: t('o_trace_random'),
                },
                {
                  type: 'trace_larger',
                  answer: formatSimpleList(vals.map(larger)),
                  info: t('o_trace_random'),
                },
                {
                  type: 'trace_extra_last',
                  answer: formatSimpleList(vals.concat(smaller(vals[0]))),
                  info: t('o_trace_extra'),
                },
                {
                  type: 'trace_extra_last',
                  answer: formatSimpleList(vals.concat(larger(vals[0]))),
                  info: t('o_trace_extra'),
                },
              ],
        ],
      ),
    };
  });
};

export const placeholder = null;
