import { QLCPrepararer } from '../types';
import { getLine } from '../analysis/getLine';
import { lastBlockNode, loopNodes } from '../analysis/travelTrees';
import { range } from '../helpers/arrays';
import { fillRandomOptions, options, pickOptions } from './options';
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

export const placeholder = undefined;
