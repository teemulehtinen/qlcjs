import { parseScriptWithLocation } from 'shift-parser';
import analyze from 'shift-scope';
import {
  ProgramModel,
  QLC,
  QLCPrepared,
  QLCTemplate,
  QLCType,
  QLCTyped,
  ProgramInput,
} from './types';
import { pickOne } from './helpers/arrays';
import { getFunctionsWithVariables } from './analysis/getFunctions';
import questions from './questions';
import { recordVariableHistory } from './executor';

export { QLC, QLCType, QLCPrepared, ProgramInput, ProgramModel } from './types';
export { SimpleValue } from './helpers/simpleValues';
export { qlcToText, qlcsToText } from './format';
export { transformToRecorded, evaluateRecorded } from './executor';

export const createProgramModel = (
  source: string,
  input?: ProgramInput,
  getFunctions?: boolean,
  recordEvaluation?: boolean,
): ProgramModel => {
  const { tree, locations, comments } = parseScriptWithLocation(source);
  const scope = analyze(tree);
  return {
    tree,
    locations,
    comments,
    scope,
    input,
    functions: getFunctions
      ? getFunctionsWithVariables(scope, tree)
      : undefined,
    recorded:
      recordEvaluation && input
        ? recordVariableHistory(
            tree,
            scope,
            input.functionName,
            pickOne(input.arguments),
          )
        : undefined,
  };
};

const selectByType = <T extends QLCTyped>(
  elements: T[],
  select: QLCType[] | undefined,
) => (select ? elements.filter(({ type }) => select.includes(type)) : elements);

const isFunctions = (templates: QLCTemplate[]) =>
  templates.find(t => t.wantsFunctions) !== undefined;

const isEvaluated = (templates: QLCTemplate[]) =>
  templates.find(t => t.wantsRecordedEvaluation) !== undefined;

export const prepare = (
  source: string,
  select?: QLCType[],
  input?: ProgramInput,
): QLCPrepared[] => {
  const templates = selectByType(questions, select);
  const data = createProgramModel(
    source,
    input,
    isFunctions(templates),
    isEvaluated(templates),
  );
  return templates
    .flatMap(({ type, prepare: prepareTemplate }) =>
      prepareTemplate(data).map(generate => ({
        type,
        generate,
      })),
    )
    .map(({ type, generate }, pos) => ({ type, pos, generate }));
};

const allUsedTypes = (requests: QLCRequest[]): QLCType[] | undefined => {
  if (requests.find(req => req.types === undefined)) {
    return undefined;
  }
  return [...new Set(requests.flatMap(req => req.types || []))];
};

export interface QLCRequest {
  count: number;
  fill?: boolean;
  types?: QLCType[];
  uniqueTypes?: boolean;
}

export const generate = (
  source: string,
  requests?: QLCRequest[],
  input?: ProgramInput,
): QLC[] => {
  const r = requests || [{ count: 1 }];
  let prepared = prepare(source, allUsedTypes(r), input);
  const out: QLC[] = [];
  r.forEach(({ count, fill, types, uniqueTypes }) => {
    let targetCount = fill ? count - out.length : count;
    while (targetCount > 0 && prepared.length > 0) {
      const sample = selectByType(prepared, types);
      const picked = pickOne(sample);
      if (picked) {
        out.push({ type: picked.type, pos: picked.pos, ...picked.generate() });
        if (uniqueTypes) {
          prepared = prepared.filter(({ type }) => type !== picked.type);
        } else {
          prepared = prepared.filter(({ pos }) => pos !== picked.pos);
        }
      }
      targetCount -= 1;
    }
  });
  return out.sort((a, b) => a.pos - b.pos);
};
