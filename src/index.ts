import { parseScriptWithLocation } from 'shift-parser';
import analyze from 'shift-scope';
import {
  ProgramModel,
  QLC,
  QLCPrepared,
  QLCType,
  QLCTyped,
  SuggestedInput,
} from './types';
import { pickIndex } from './helpers/arrays';
import { getFunctionsWithVariables } from './analysis/getFunctions';
import questions from './questions';

export { QLC, QLCType, SuggestedInput } from './types';

export const createProgramModel = (
  source: string,
  inputs?: SuggestedInput[],
): ProgramModel => {
  const { tree, locations, comments } = parseScriptWithLocation(source);
  const scope = analyze(tree);
  return {
    tree,
    locations,
    comments,
    scope,
    functions: getFunctionsWithVariables(scope, tree),
    inputs: inputs || [],
  };
};

const selectByType = <T extends QLCTyped>(
  elements: T[],
  select: QLCType[] | undefined,
) => (select ? elements.filter(({ type }) => select.includes(type)) : elements);

export const prepare = (
  source: string,
  select?: QLCType[],
  inputs?: SuggestedInput[],
): QLCPrepared[] => {
  const data = createProgramModel(source, inputs);
  return selectByType(questions, select)
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
  inputs?: SuggestedInput[],
): QLC[] => {
  const r = requests || [{ count: 1 }];
  let prepared = prepare(source, allUsedTypes(r), inputs);
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
