import { Script } from 'shift-ast';
import { Comment, LocationMap } from 'shift-parser';
import { Scope } from 'shift-scope';

export interface QLCTemplate {
  type: QLCType;
  prepare: (model: ProgramModel) => QLCGenerator[];
}

export interface QLCPrepared {
  key: number;
  type: QLCType;
  generate: QLCGenerator;
}

export interface ProgramModel {
  scope: Scope;
  tree: Script;
  locations: LocationMap;
  comments: Comment[];
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

export interface QLC extends QLCBase {
  type: QLCType;
}

export interface QLCRequest {
  count: number;
  fill?: boolean;
  types?: QLCType[];
  uniqueTypes?: boolean;
}

export type QLCType = 'FunctionName';
