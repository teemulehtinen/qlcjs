import { QLCPrepararer } from '../types';
import { lastBlockNode, loopNodes } from '../analysis/select';
import {
  getVariables,
  parseReferences,
  VariableDeclarations,
} from '../analysis/getVariables';
import { getLine } from '../analysis/getLine';
import { fillRandomOptions, options, pickOptions } from './options';
import { pickOne, range } from '../helpers/arrays';
import t from '../i18n';

export const loopEnd: QLCPrepararer = ({ tree, locations }) =>
  loopNodes(tree).map(loop => () => {
    const beg = getLine(loop, locations);
    const end = getLine(lastBlockNode(loop.body), locations, true);
    return {
      question: t('q_loop_end', beg),
      options: pickOptions(
        options(end, 'last_line_inside_block', t('o_loop_end_correct'), true),
        options(beg - 1, 'line_before_block', t('o_loop_end_before')),
        options(end + 2, 'line_after_block', t('o_loop_end_after')),
        fillRandomOptions(
          6,
          () => range(beg, end - 1),
          'line_inside_block',
          t('o_loop_end_inside'),
        ),
      ),
    };
  });

export const variableDeclaration: QLCPrepararer = ({ scope, locations }) =>
  parseReferences(getVariables(scope, VariableDeclarations), locations, true)
    .filter(({ reads, writes }) => reads.length > 0 || writes.length > 0)
    .map(({ name, declaration, reads, writes }) => () => {
      const isWrite = writes.length > 0;
      const ref = pickOne(isWrite ? writes : reads);
      const refLines = [...new Set(reads.concat(writes).map(r => r.line))];
      return {
        question: t(
          isWrite
            ? 'q_variable_write_declaration'
            : 'q_variable_read_declaration',
          name,
          ref.line,
        ),
        options: pickOptions(
          options(
            declaration.line,
            'declaration_line',
            t(
              'o_variable_declaration_correct',
              declaration.type.name.toLowerCase(),
            ),
            true,
          ),
          options(
            refLines,
            'reference_line',
            t('o_variable_declaration_reference'),
          ),
          fillRandomOptions(
            5,
            () => range(declaration.line - 2, Math.max(...refLines) + 2),
            'random_line',
            t('o_variable_declaration_random'),
          ),
        ),
      };
    });

export const placeholder = undefined;
