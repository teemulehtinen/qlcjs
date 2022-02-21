import {
  ForInStatement,
  ForOfStatement,
  ForStatement,
  LiteralBooleanExpression,
  LiteralNumericExpression,
  LiteralStringExpression,
  Node,
  WhileStatement,
} from 'shift-ast';
import children from './travelChildren';
import { isNode } from './types';

export type Visitor = (node: Node, stack: Node[]) => boolean | void;

export const walk = (parent: Node, enter?: Visitor, leave?: Visitor): void => {
  const recursion = (node: Node, stack: Node[]) => {
    const flag = enter ? enter(node, stack) : true;
    if (flag !== false) {
      const newStack = [node].concat(stack);
      children(node).forEach(child => recursion(child, newStack));
    }
    if (leave) {
      leave(node, stack);
    }
  };
  recursion(parent, []);
};

export const flat = (parent: Node): Node[] => {
  const out: Node[] = [];
  walk(parent, (n: Node) => {
    out.push(n);
  });
  return out;
};

export const find = <T extends Node>(parent: Node, types: string[]): T[] =>
  flat(parent)
    .filter(n => isNode<T>(n, types))
    .map(n => n as T);

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
