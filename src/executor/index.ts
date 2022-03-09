import {
  AssignmentExpression,
  CallExpression,
  Expression,
  IdentifierExpression,
  LiteralNumericExpression,
  LiteralStringExpression,
  Node,
  VariableDeclarator,
} from 'shift-ast';
import { Scope, Variable } from 'shift-scope';
import codegen, { FormattedCodeGen } from 'shift-codegen';
import { getVariables, VariableDeclarations } from '../analysis/getVariables';
import transform from '../trees/transform';
import { unpackCompoundExpression } from './compound';

const RECORD_FUNCTION = '__record';

interface RecordableVariable extends Variable {
  index: number;
  writes: Node[];
  recorded: Node[];
}

const checkWriteNode = (
  n: Node,
  variables: RecordableVariable[],
): RecordableVariable | undefined => {
  const hit = variables.find(v => v.writes.includes(n));
  if (hit !== undefined) {
    hit.recorded.push(n);
  }
  return hit;
};

const valueRecordExpression = (
  index: number,
  name: string,
  value: Expression,
): CallExpression =>
  new CallExpression({
    callee: new IdentifierExpression({ name: RECORD_FUNCTION }),
    arguments: [
      new LiteralNumericExpression({ value: index }),
      new LiteralStringExpression({ value: name }),
      value,
    ],
  });

export const recordedScript = (root: Node, global: Scope) => {
  const variables: RecordableVariable[] = getVariables(
    global,
    VariableDeclarations,
  ).map((v, i) => ({
    ...v,
    index: i,
    writes: v.references
      .filter(r => r.accessibility.isWrite)
      .map(({ node }) => node),
    recorded: [],
  }));
  const tree = transform(root, (node: Node): Node => {
    switch (node.type) {
      case 'VariableDeclarator':
        if (node.binding.type === 'BindingIdentifier' && node.init) {
          const v = checkWriteNode(node.binding, variables);
          if (v !== undefined) {
            return new VariableDeclarator({
              binding: node.binding,
              init: valueRecordExpression(v.index, v.name, node.init),
            });
          }
        }
        return node;
      case 'AssignmentExpression':
        if (node.binding.type === 'AssignmentTargetIdentifier') {
          const v = checkWriteNode(node.binding, variables);
          if (v !== undefined) {
            return new AssignmentExpression({
              binding: node.binding,
              expression: valueRecordExpression(
                v.index,
                v.name,
                node.expression,
              ),
            });
          }
        }
        return node;
      case 'CompoundAssignmentExpression':
        if (node.binding.type === 'AssignmentTargetIdentifier') {
          const v = checkWriteNode(node.binding, variables);
          if (v !== undefined) {
            return new AssignmentExpression({
              binding: node.binding,
              expression: valueRecordExpression(
                v.index,
                v.name,
                unpackCompoundExpression(node),
              ),
            });
          }
        }
        return node;
      default:
        return node;
    }
  });
  return {
    tree,
    script: codegen(tree, new FormattedCodeGen()),
    variables: variables.filter(
      ({ writes, recorded }) =>
        recorded.length > 0 && recorded.length === writes.length,
    ),
  };
};

export const evalAndExtract = () => {
  // Call eval
  // Access global records
  return undefined;
};
