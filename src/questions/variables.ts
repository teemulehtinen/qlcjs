import { QLCPrepararer } from '../types';
import {
  getVariables,
  parseReferences,
  VariableDeclarations,
} from '../analysis/getVariables';
import { pickOne, range } from '../helpers/arrays';
import { fillRandomOptions, options, pickOptions } from './options';
import t from '../i18n';

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
