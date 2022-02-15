import { Node as EstreeNode } from 'estree';

export type Node = EstreeNode;

export type QLC = {
  question: string;
  options: {
    answer: string;
    correct: boolean;
  }[];
};

export type QLCTemplate = {
  type: QLCType;
  prepare: (ast: Node) => {
    available: boolean;
    generate: (n?: number) => QLC[];
  };
};

export type QLCType = 'FunctionName';
