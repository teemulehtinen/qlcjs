import { Node } from 'estree';
export declare type NodeListener = (node: Node) => void;
export declare const children: (node: Node) => Node[];
export declare const walk: (node: Node, enter?: NodeListener | undefined, leave?: NodeListener | undefined) => void;
