import { Node as EstreeNode } from 'estree';

export type Node = EstreeNode;

export type QLCGenerator = () => QLCBase;

export interface QLCTemplate {
  type: QLCType;
  prepare: (ast: Node) => QLCGenerator[];
}

export interface QLCPrepared {
  key: number;
  type: QLCType;
  generate: QLCGenerator;
}

export interface QLCBase {
  question: string;
  options: {
    answer: string;
    correct: boolean;
  }[];
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
