import {
  ArrowExpression,
  FunctionDeclaration,
  FunctionExpression,
  Node,
  Script,
} from 'shift-ast';
import { Comment, LocationMap } from 'shift-parser';
import { Scope, Variable } from 'shift-scope';
import { SimpleValue } from './helpers/simpleValues';

export const isNode = <T extends Node>(
  node: Node,
  types: string[],
): node is T => types.includes(node.type);

export interface QLCTyped {
  type: QLCType;
}

export interface QLCTemplate extends QLCTyped {
  prepare: QLCPrepararer;
}

export type QLCPrepararer = (model: ProgramModel) => QLCGenerator[];

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
  inputs: SuggestedInput[];
}

export interface FunctionWithVariables {
  name: string;
  astNode: FunctionDeclaration | ArrowExpression | FunctionExpression;
  variables: Variable[];
}

export interface SuggestedInput {
  functionName: string;
  parameters: SimpleValue[][];
}

export type QLCGenerator = () => QLCBase;

export interface QLCBase {
  question: string;
  options: QLCOption[];
}

export interface QLCOption {
  type: string;
  answer: string | number;
  correct?: boolean;
  info?: string;
}

export interface QLC extends QLCTyped, QLCBase {}

export type QLCType =
  | 'FunctionName'
  | 'ParameterName'
  | 'ParameterValue'
  | 'LoopEnd'
  | 'VariableDeclaration';
