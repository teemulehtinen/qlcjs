import { Node } from 'shift-ast';
export declare type Transformer = (node: Node, stack: Node[]) => Node;
declare type RecursiveTransform = <T extends Node>(node: T, stack: Node[], tr: Transformer) => T;
declare const transformChildren: <T extends Node>(node: T, stack: Node[], r: RecursiveTransform, tr: Transformer) => T;
export default transformChildren;
