import { QLC, SimpleValue } from '../src';

export const getCorrect = (qlcs: QLC[]) =>
  qlcs.flatMap(q => q.options.filter(o => o.correct).map(o => o.answer)).sort();

export const splitCorrectAndDistractors = (
  qlc: QLC,
): { correct: (string | number)[]; distractors: (string | number)[] } => ({
  correct: qlc.options.filter(o => o.correct).map(o => o.answer),
  distractors: qlc.options.filter(o => !o.correct).map(o => o.answer),
});

export const overlaps = (
  test: (string | number)[],
  cover: (string | number)[],
) => test.every(w => cover.includes(w));
