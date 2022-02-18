import { Node } from 'shift-ast';
import { flat } from './travelTrees';

export const keyword = (n: Node): string[] => {
  switch (n.type) {
    case 'AwaitExpression':
      return ['await'];
    case 'BreakStatement':
      return ['break'];
    case 'CatchClause':
      return ['catch'];
    case 'ClassDeclaration':
      return ['class'];
    case 'ContinueStatement':
      return ['continue'];
    case 'DoWhileStatement':
      return ['do', 'while'];
    case 'ForAwaitStatement':
      return ['for await', 'of'];
    case 'ForInStatement':
      return ['for', 'in'];
    case 'ForOfStatement':
      return ['for', 'of'];
    case 'ForStatement':
      return ['for'];
    case 'FunctionDeclaration':
      return ['function'];
    case 'IfStatement':
      return ['if'];
    case 'ReturnStatement':
      return ['return'];
    case 'SwitchCase':
      return ['case'];
    case 'SwitchDefault':
      return ['default'];
    case 'SwitchStatement':
    case 'SwitchStatementWithDefault':
      return ['switch'];
    case 'ThrowStatement':
      return ['throw'];
    case 'TryCatchStatement':
      return ['try'];
    case 'TryFinallyStatement':
      return ['try', 'finally'];
    case 'VariableDeclaration':
      return [n.kind];
    case 'WhileStatement':
      return ['while'];
    case 'WithStatement':
      return ['with'];
    case 'YieldExpression':
      return ['yield'];
    default:
      return [];
  }
};

export const getKeywords = (parent: Node): string[] =>
  flat(parent).flatMap(n => keyword(n));
