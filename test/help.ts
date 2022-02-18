import { QLC } from '../src';

export const getCorrect = (qlcs: QLC[]) =>
  qlcs.flatMap(q => q.options.filter(o => o.correct).map(o => o.answer)).sort();

export const splitCorrectAndDistractors = (
  qlc: QLC,
): { correct: string[]; distractors: string[] } => ({
  correct: qlc.options
    .filter(o => o.correct)
    .map(o => o.answer)
    .sort(),
  distractors: qlc.options
    .filter(o => !o.correct)
    .map(o => o.answer)
    .sort(),
});

export const overlaps = (test: string[], cover: string[]) =>
  test.every(w => cover.includes(w));
