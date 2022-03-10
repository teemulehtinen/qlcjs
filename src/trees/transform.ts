import { Node } from 'shift-ast';
import transformChildren, { Transformer } from './transformChildren';

export { Transformer } from './transformChildren';

const transformRecursive = <T extends Node>(
  node: T,
  stack: Node[],
  tr: Transformer,
): T =>
  tr(
    transformChildren(node, stack.concat(node), transformRecursive, tr),
    stack,
  ) as T;

const transform = (parent: Node, tr: Transformer): Node =>
  transformRecursive(parent, [], tr);

export default transform;
