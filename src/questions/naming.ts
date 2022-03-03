import { QLCPrepararer } from '../types';
import { methodCalls } from '../analysis/select';
import { getLine } from '../analysis/getLine';
import { options, pickOptions } from './options';
import t from '../i18n';

export const methodCall: QLCPrepararer = ({ tree, locations }) =>
  methodCalls(tree).map(({ callee }) => () => {
    return {
      question: t('q_method_call', callee.property, getLine(callee, locations)),
      options: pickOptions(
        options('argument', 'argument', t('o_name_argument')),
        options('keyword', 'keyword', t('o_name_keyword')),
        options('method', 'method', t('o_method_correct'), true),
        options('operator', 'operator', t('o_name_operator')),
        options('parameter', 'parameter', t('o_name_parameter')),
      ),
    };
  });

export const placeholder = undefined;
