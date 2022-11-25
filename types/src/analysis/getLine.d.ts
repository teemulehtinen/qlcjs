import { Node } from 'shift-ast';
import { LocationMap } from 'shift-parser';
export declare const getLine: (node: Node, locations: LocationMap, end?: boolean | undefined) => number;
export declare const getLines: (nodes: Node[], locations: LocationMap, end?: boolean | undefined) => number[];
