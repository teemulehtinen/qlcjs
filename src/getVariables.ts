import { LocationMap } from 'shift-parser';
import { Declaration, Reference, Scope, Variable } from 'shift-scope';

export const getVariables = (
  global: Scope,
  declarationTypes?: string[],
): Variable[] => {
  const out: Variable[] = [];
  const recursion = (scope: Scope) => {
    if (declarationTypes !== undefined) {
      out.push(
        ...scope.variableList.filter(
          ({ declarations }) =>
            declarations.length > 0 &&
            declarationTypes.includes(declarations[0].type.name),
        ),
      );
    } else {
      out.push(...scope.variableList);
    }
    scope.children.forEach(child => recursion(child));
  };
  recursion(global);
  return out;
};

export const VariableDeclarations = ['Var', 'Const', 'Let'];
export const ParameterDeclarations = ['Parameter'];
export const FunctionDeclarations = [
  'FunctionDeclaration',
  'FunctionB33',
  'FunctionExpressionName',
];

export interface VariableReferences extends Variable {
  declaration: DeclarationWithLine;
  reads: ReferenceWithLine[];
  writes: ReferenceWithLine[];
}

export interface DeclarationWithLine extends Declaration {
  line: number;
}

export interface ReferenceWithLine extends Reference {
  line: number;
}

const checkLines = (
  dec: DeclarationWithLine,
  refs: ReferenceWithLine[],
  requireDifferentLine?: boolean,
) =>
  requireDifferentLine ? refs.filter(({ line }) => line !== dec.line) : refs;

export const parseReferences = (
  variables: Variable[],
  locations: LocationMap,
  requireDifferentLine?: boolean,
): VariableReferences[] =>
  variables
    .map(v => {
      const decs: DeclarationWithLine[] = v.declarations
        .map(d => ({
          ...d,
          line: locations.get(d.node)?.start.line,
        }))
        .filter((d): d is DeclarationWithLine => d.line !== undefined);
      return {
        ...v,
        declaration: decs[0],
      };
    })
    .filter(({ declaration }) => declaration !== undefined)
    .map(v => {
      const refs: ReferenceWithLine[] = checkLines(
        v.declaration,
        v.references
          .map(r => ({
            ...r,
            line: locations.get(r.node)?.start.line,
          }))
          .filter((r): r is ReferenceWithLine => r.line !== undefined),
        requireDifferentLine,
      );
      return {
        ...v,
        reads: refs.filter(({ accessibility: a }) => a.isRead),
        writes: refs.filter(
          ({ accessibility: a }) => a.isWrite || a.isReadWrite,
        ),
      };
    });
