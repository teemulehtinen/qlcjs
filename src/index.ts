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
import { pickIndex, pickOne } from './helpers/arrays';
import { getFunctionsWithVariables } from './analysis/getFunctions';
import questions from './questions';
import { recordVariableHistory } from './executor';

export { QLC, QLCType, QLCPrepared, ProgramInput, ProgramModel } from './types';
export { SimpleValue } from './helpers/simpleValues';
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
    .map(({ type, generate }, key) => ({ key, generate, type }));
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
  const out: [number, QLC][] = [];
  r.forEach(({ count, fill, types, uniqueTypes }) => {
    let targetCount = fill ? count - out.length : count;
    while (targetCount > 0 && prepared.length > 0) {
      const sample = selectByType(prepared, types);
      const i = pickIndex(sample);
      const picked = sample[i];
      if (picked) {
        out.push([i, { type: picked.type, ...picked.generate() }]);
        if (uniqueTypes) {
          prepared = prepared.filter(({ type }) => type !== picked.type);
        } else {
          prepared = prepared.filter(({ key }) => key !== picked.key);
        }
      }
      targetCount -= 1;
    }
  });
  return out.sort((a, b) => a[0] - b[0]).map(o => o[1]);
};
