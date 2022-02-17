/// <reference types="node" />

declare module 'shift-scope' {
  import { Node } from 'shift-ast';

  export default function analyze(node: Node): Scope;

  export interface Scope {
    children: Scope[];
    through: MultimapGetOnly<string, Reference>;
    type: ScopeType;
    astNode: Node;
    variables: Map<string, Variable>;
    variableList: Variable[];
    dynamic: boolean;
    isGlobal: () => boolean;
    lookupVariable: (name: string) => Variable | undefined;
  }

  export interface ScopeType {
    name:
      | 'Global'
      | 'Module'
      | 'Script'
      | 'ArrowFunction'
      | 'Function'
      | 'FunctionName'
      | 'ClassName'
      | 'Parameters'
      | 'ParameterExpression'
      | 'With'
      | 'Catch'
      | 'Block';
  }

  export interface Variable {
    name: string;
    references: Reference[];
    declarations: Declaration[];
  }

  export interface Reference {
    node: Node;
    accessibility: Accessibility;
  }

  export interface Accessibility {
    isRead: boolean;
    isWrite: boolean;
    isReadWrite: boolean;
    isDelete: boolean;
  }

  export interface Declaration {
    node: Node;
    type: DeclarationType;
  }

  export interface DeclarationType {
    name:
      | 'Var'
      | 'Const'
      | 'Let'
      | 'FunctionDeclaration'
      | 'FunctionB33'
      | 'FunctionExpressionName'
      | 'ClassDeclaration'
      | 'ClassName'
      | 'Parameter'
      | 'CatchParam'
      | 'Import';
    isBlockScoped: boolean;
    isFunctionScoped: boolean;
  }

  export interface MultimapGetOnly<K, V> {
    size: number;
    count: number;
    has: (key: K, val?: V) => boolean;
    get: (name: K) => V[];
  }
}
