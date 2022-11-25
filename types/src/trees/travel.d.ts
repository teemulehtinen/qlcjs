import { Node } from 'shift-ast';
export declare type Visitor = (node: Node, stack: Node[]) => boolean | void;
export declare const walk: (parent: Node, enter?: Visitor | undefined, leave?: Visitor | undefined) => void;
export declare const flat: (parent: Node) => Node[];
export declare const find: <T extends Node>(parent: Node, types: string[]) => T[];
