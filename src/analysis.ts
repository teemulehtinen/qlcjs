import { FunctionDeclaration, FunctionExpression, Identifier } from 'estree';
import { Node } from './types';
import { select, walk } from './walker';

export type Naming = {
  fun?: string;
  parameters: Set<string>;
  variables: Set<string>;
  keywords: Set<string>;
};

export type FunctionNaming = {
  fun: string;
  parameters: Set<string>;
  variables: Set<string>;
  keywords: Set<string>;
};

export const extractNaming = (ast: Node): Naming[] =>
  select<FunctionDeclaration | FunctionExpression>(ast, [
    'FunctionDeclaration',
    'FunctionExpression',
  ]).map(node => {
    const parameters = new Set(
      select<Identifier>(node.params, ['Identifier']).map(n => n.name),
    );
    const variables = new Set<string>();
    const keywords = new Set<string>();
    walk(node.body, child => {
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
    return { fun: node.id?.name, parameters, variables, keywords };
  });

export const extractFunctionNaming = (ast: Node): FunctionNaming[] =>
  extractNaming(ast).filter((n): n is FunctionNaming => n.fun !== undefined);

export default extractNaming;
