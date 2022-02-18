import { parseScriptWithLocation } from 'shift-parser';
import analyze from 'shift-scope';
import { ProgramModel, QLC, QLCPrepared, QLCType, QLCTyped } from './types';
import questions from './questions';
import { getFunctionsWithVariables } from './getFunctions';

export { QLC, QLCType } from './types';

export const createProgramModel = (source: string): ProgramModel => {
  const { tree, locations, comments } = parseScriptWithLocation(source);
  const scope = analyze(tree);
  return {
    tree,
    locations,
    comments,
    scope,
    functions: getFunctionsWithVariables(scope, tree),
  };
};

const selectByType = <T extends QLCTyped>(
  elements: T[],
  select: QLCType[] | undefined,
) => (select ? elements.filter(({ type }) => select.includes(type)) : elements);

export const prepare = (source: string, select?: QLCType[]): QLCPrepared[] => {
  const data = createProgramModel(source);
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

const pick = (selected: QLCPrepared[]) => {
  if (selected.length === 0) {
    return undefined;
  }
  return selected[Math.floor(Math.random() * selected.length)];
};

export interface QLCRequest {
  count: number;
  fill?: boolean;
  types?: QLCType[];
  uniqueTypes?: boolean;
}

export const generate = (source: string, requests: QLCRequest[]): QLC[] => {
  let prepared = prepare(source, allUsedTypes(requests));
  const out: QLC[] = [];
  requests.forEach(({ count, fill, types, uniqueTypes }) => {
    let targetCount = fill ? count - out.length : count;
    while (targetCount > 0 && prepared.length > 0) {
      const picked = pick(selectByType(prepared, types));
      if (picked) {
        out.push({ type: picked.type, ...picked.generate() });
        if (uniqueTypes) {
          prepared = prepared.filter(({ type }) => type !== picked.type);
        } else {
          prepared = prepared.filter(({ key }) => key !== picked.key);
        }
      }
      targetCount -= 1;
    }
  });
  return out;
};
