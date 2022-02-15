import { Node } from './types';
import { select, walk } from './walker';

export type Naming = {
  fun?: string;
  variables: Set<string>;
  keywords: Set<string>;
};

export type FunctionNaming = {
  fun: string;
  variables: Set<string>;
  keywords: Set<string>;
};

export const extractNaming = (ast: Node): Naming[] =>
  select(ast, ['FunctionDeclaration', 'FunctionExpression']).map(node => {
    const keywords = new Set<string>(['function']);
    const variables = new Set<string>();
    walk(ast, child => {
      switch (child.type) {
        case 'VariableDeclaration':
          keywords.add(child.kind);
          child.declarations.forEach(dec => {
            if (dec.id.type === 'Identifier') {
              variables.add(dec.id.name);
            }
          });
          break;
        case 'ForStatement':
          keywords.add('for');
          break;
        case 'ReturnStatement':
          keywords.add('return');
          break;
        default:
          break;
      }
      return true;
    });
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression'
    ) {
      return { fun: node.id?.name, variables, keywords };
    }
    return { fun: undefined, variables, keywords };
  });

export const extractFunctionNaming = (ast: Node): FunctionNaming[] =>
  extractNaming(ast).filter((n): n is FunctionNaming => n.fun !== undefined);

export default extractNaming;
