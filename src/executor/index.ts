import {
  AssignmentExpression,
  CallExpression,
  Expression,
  IdentifierExpression,
  LiteralNumericExpression,
  LiteralStringExpression,
  Node,
  UpdateExpression,
  VariableDeclarator,
} from 'shift-ast';
import { Scope, Variable } from 'shift-scope';
import codegen, { FormattedCodeGen } from 'shift-codegen';
import { getVariables, VariableDeclarations } from '../analysis/getVariables';
import transform from '../trees/transform';
import {
  unpackAssignmentIdentifier,
  unpackCompoundExpression,
} from './compound';
import { simpleToProgram, SimpleValue } from '../helpers/simpleValues';

const RECORD_FUNCTION = '__record';
const RECORD_STORE = '__record_store';

export interface RecordableVariable extends Variable {
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
  recordValue?: Expression,
): CallExpression =>
  new CallExpression({
    callee: new IdentifierExpression({ name: RECORD_FUNCTION }),
    arguments:
      recordValue !== undefined
        ? [
            new LiteralNumericExpression({ value: index }),
            new LiteralStringExpression({ value: name }),
            value,
            recordValue,
          ]
        : [
            new LiteralNumericExpression({ value: index }),
            new LiteralStringExpression({ value: name }),
            value,
          ],
  });

export const transformToRecorded = (root: Node, global: Scope) => {
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
      case 'UpdateExpression':
        if (node.operand.type === 'AssignmentTargetIdentifier') {
          const v = checkWriteNode(node.operand, variables);
          if (v !== undefined) {
            if (node.isPrefix) {
              return valueRecordExpression(v.index, v.name, node);
            }
            return valueRecordExpression(
              v.index,
              v.name,
              unpackAssignmentIdentifier(node.operand),
              new UpdateExpression({
                isPrefix: true,
                operator: node.operator,
                operand: node.operand,
              }),
            );
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

export const evaluateRecorded = (
  script: string,
  functionName?: string,
  functionArguments?: SimpleValue[],
): { [k: string]: SimpleValue[] } => {
  const argstr = functionArguments?.map(simpleToProgram).join(', ');
  // eslint-disable-next-line no-new-func
  return new Function(`
    ${RECORD_STORE} = {};
    ${RECORD_FUNCTION} = (index, name, value, rec) => {
      const key = index + '_' + name;
      ${RECORD_STORE}[key] = (${RECORD_STORE}[key] || []).concat(rec || value);
      return value;
    };
    ${script}
    ${functionName ? `;${functionName}(${argstr})` : ''}
    return ${RECORD_STORE};
  `)();
};

export const recordVariableHistory = (
  root: Node,
  global: Scope,
  functionName?: string,
  functionArguments?: SimpleValue[],
) => {
  const { script, variables } = transformToRecorded(root, global);
  const history = evaluateRecorded(script, functionName, functionArguments);
  return { arguments: functionArguments, variables, history };
};
