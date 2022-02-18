import { Node, Script } from 'shift-ast';
import { Comment, LocationMap } from 'shift-parser';
import { Scope } from 'shift-scope';
import { FunctionWithVariables } from './getFunctions';

export const isNode = <T extends Node>(
  node: Node,
  types: string[],
): node is T => types.includes(node.type);

export interface QLCTyped {
  type: QLCType;
}

export interface QLCTemplate extends QLCTyped {
  prepare: (model: ProgramModel) => QLCGenerator[];
}

export interface QLCPrepared extends QLCTyped {
  key: number;
  generate: QLCGenerator;
}

export interface ProgramModel {
  tree: Script;
  locations: LocationMap;
  comments: Comment[];
  scope: Scope;
  functions: FunctionWithVariables[];
}

export type QLCGenerator = () => QLCBase;

export interface QLCBase {
  question: string;
  options: QLCOption[];
}

export interface QLCOption {
  answer: string;
  correct?: boolean;
}

export interface QLC extends QLCTyped, QLCBase {}

export type QLCType = 'FunctionName';
