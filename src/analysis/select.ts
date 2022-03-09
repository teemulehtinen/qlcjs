import {
  CallExpression,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  LiteralBooleanExpression,
  LiteralNumericExpression,
  LiteralStringExpression,
  Node,
  StaticMemberExpression,
  WhileStatement,
} from 'shift-ast';
import { isNode } from '../types';
import { find } from '../trees/travel';

export type SimpleLiterals =
  | LiteralBooleanExpression
  | LiteralNumericExpression
  | LiteralStringExpression;

export const literalNodes = (parent: Node) =>
  find<SimpleLiterals>(parent, [
    'LiteralBooleanExpression',
    'LiteralNumericExpression',
    'LiteralStringExpression',
  ]);

export const literalValues = (parent: Node) =>
  literalNodes(parent).map(n => n.value);

export type SimpleLoops =
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | WhileStatement;

export const loopNodes = (parent: Node) =>
  find<SimpleLoops>(parent, [
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'WhileStatement',
  ]);

export const lastBlockNode = (parent: Node) => {
  if (parent.type === 'BlockStatement') {
    const { statements } = parent.block;
    return statements[statements.length - 1];
  }
  return parent;
};

export interface MethodCall {
  call: CallExpression;
  callee: StaticMemberExpression;
}

export const methodCalls = (parent: Node): MethodCall[] =>
  find<CallExpression>(parent, ['CallExpression'])
    .filter(call =>
      isNode<StaticMemberExpression>(call.callee, ['StaticMemberExpression']),
    )
    .map(call => ({ call, callee: call.callee as StaticMemberExpression }));
