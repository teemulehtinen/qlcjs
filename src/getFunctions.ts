import {
  ArrowExpression,
  BindingIdentifier,
  FormalParameters,
  FunctionDeclaration,
  FunctionExpression,
  Node,
} from 'shift-ast';
import { Scope, Variable } from 'shift-scope';
import { find, walk } from './travelTrees';

export const isFunctionExpression = (
  node: Node,
): node is ArrowExpression | FunctionExpression =>
  ['ArrowExpression', 'FunctionExpression'].includes(node.type);

export const searchFunctionVariables = (root: Node) => {
  const nameMap: Map<ArrowExpression | FunctionExpression, string> = new Map();
  walk(root, (node: Node, stack: Node[]) => {
    if (
      isFunctionExpression(node) &&
      stack[0].type === 'VariableDeclarator' &&
      stack[0].binding.type === 'BindingIdentifier'
    ) {
      nameMap.set(node, stack[0].binding.name);
    }
    return true;
  });
  return nameMap;
};

export interface FunctionWithVariables {
  name: string;
  astNode: FunctionDeclaration | ArrowExpression | FunctionExpression;
  variables: Variable[];
}

export const getFunctionsWithVariables = (
  global: Scope,
  root: Node,
): FunctionWithVariables[] => {
  const out: FunctionWithVariables[] = [];
  const nameMap = searchFunctionVariables(root);
  const recursion = (scope: Scope, upper: Variable[]) => {
    const variables = scope.variableList.filter(
      v => v.declarations.length > 0 || v.references.length > 0,
    );
    if (
      (scope.type.name === 'ArrowFunction' &&
        scope.astNode.type === 'ArrowExpression') ||
      (scope.type.name === 'Function' &&
        scope.astNode.type === 'FunctionExpression')
    ) {
      const name = nameMap.get(scope.astNode);
      if (name) {
        out.push({
          name,
          astNode: scope.astNode,
          variables,
        });
        scope.children.forEach(child => recursion(child, variables));
      }
    } else if (
      scope.type.name === 'Function' &&
      scope.astNode.type === 'FunctionDeclaration'
    ) {
      out.push({
        name: scope.astNode.name.name,
        astNode: scope.astNode,
        variables,
      });
      scope.children.forEach(child => recursion(child, variables));
    } else {
      const merged = upper.concat(variables);
      scope.children.forEach(child => recursion(child, merged));
    }
  };
  recursion(global, []);
  return out;
};

export const getParameterNames = (params: FormalParameters): string[] =>
  find<BindingIdentifier>(params, ['BindingIdentifier']).map(p => p.name);
