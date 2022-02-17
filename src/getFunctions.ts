import { ArrowExpression, FunctionExpression, Node } from 'shift-ast';
import { Scope, Variable } from 'shift-scope';
import { walk } from './travelTrees';

export interface FunctionWithVariables {
  name: string;
  astNode: Node;
  variables: Variable[];
}

const isFunctionExpression = (
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

export const getFunctionsWithVariables = (
  global: Scope,
  root: Node,
): FunctionWithVariables[] => {
  const out: FunctionWithVariables[] = [];
  const nameMap = searchFunctionVariables(root);
  const recursion = (scope: Scope, upper: Variable[]) => {
    if (
      (scope.type.name === 'ArrowFunction' &&
        scope.astNode.type === 'ArrowExpression') ||
      (scope.type.name === 'Function' &&
        scope.astNode.type === 'FunctionExpression')
    ) {
      const name = nameMap.get(scope.astNode);
      if (name) {
        const variables = [...scope.variableList];
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
      const variables = [...scope.variableList];
      out.push({
        name: scope.astNode.name.name,
        astNode: scope.astNode,
        variables,
      });
      scope.children.forEach(child => recursion(child, variables));
    } else {
      const merged = upper.concat(scope.variableList);
      scope.children.forEach(child => recursion(child, merged));
    }
  };
  recursion(global, []);
  return out;
};
