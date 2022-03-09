import { Node } from 'shift-ast';
import { isNode } from '../types';
import children from './travelChildren';

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
