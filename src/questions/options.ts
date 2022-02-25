import {
  ArrayRequest,
  asArray,
  pickFrom,
  sortNumberOrString,
} from '../helpers/arrays';
import { QLCOption } from '../types';

type Answer = string | number | (string | number)[];

const opt = (
  answers: Answer,
  type: string,
  info?: string,
  correct?: boolean,
): QLCOption[] =>
  asArray(answers).map(answer => ({ type, answer, correct, info }));

export const options = (
  answers: Answer,
  type: string,
  info?: string,
  correct?: boolean,
): ArrayRequest<QLCOption> => [opt(answers, type, info, correct)];

export const randomOptions = (
  count: number,
  answers: () => string | number | (string | number)[],
  type: string,
  info?: string,
): ArrayRequest<QLCOption> => [() => opt(answers(), type, info), count];

export const fillRandomOptions = (
  count: number,
  answers: () => string | number | (string | number)[],
  type: string,
  info?: string,
): ArrayRequest<QLCOption> => [() => opt(answers(), type, info), count, true];

const toArrayRequests = (
  rs: (ArrayRequest<QLCOption> | undefined)[],
): ArrayRequest<QLCOption>[] =>
  rs.filter((r): r is ArrayRequest<QLCOption> => r !== undefined);

export const pickOptions = (
  ...requests: (ArrayRequest<QLCOption> | undefined)[]
): QLCOption[] =>
  pickFrom(e => e.answer.toString(), ...toArrayRequests(requests)).sort(
    (a, b) => sortNumberOrString(a.answer, b.answer),
  );
