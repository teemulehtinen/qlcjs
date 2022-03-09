/// <reference types="node" />

declare module 'shift-codegen' {
  import { Node } from 'shift-ast';

  export default function codeGen(script: Node, generator?: Reducer): string;

  export const MinimalCodeGen: ReducerClass;
  export const ExtensibleCodeGen: ExtensibleReducerClass;
  export const FormattedCodeGen: ExtensibleReducerClass;

  export function codeGenWithLocation(
    program: Node,
    generator?: Reducer,
  ): { source: string; locations: LocationMap };

  export type LocationMap = Map<Node, SourceRange>;

  export interface SourceRange {
    start: SourceLocation;
    end: SourceLocation;
  }

  export interface SourceLocation {
    line: number;
    column: number;
    offset: number;
  }

  export interface ReducerClass {
    new (): Reducer;
  }

  export interface ExtensibleReducerClass {
    new (): ExtensibleReducer;
  }

  export interface Reducer {
    reduceArrayAssignmentTarget: (
      n: Node,
      children: { elements: Node[]; rest?: Node },
    ) => Node;
    reduceArrayBinding: (
      n: Node,
      children: { elements: Node[]; rest?: Node },
    ) => Node;
    reduceArrayExpression: (n: Node, children: { elements: Node[] }) => Node;
    reduceArrowExpression: (
      n: Node,
      children: { params: Node; body: Node },
    ) => Node;
    reduceAssignmentExpression: (
      n: Node,
      children: { binding: Node; expression: Node },
    ) => Node;
    reduceAssignmentTargetIdentifier: (n: Node) => Node;
    reduceAssignmentTargetPropertyIdentifier: (
      n: Node,
      children: { binding: Node; init?: Node },
    ) => Node;
    reduceAssignmentTargetPropertyProperty: (
      n: Node,
      children: { name: Node; binding: Node },
    ) => Node;
    reduceAssignmentTargetWithDefault: (
      n: Node,
      children: { binding: Node; init: Node },
    ) => Node;
    reduceAwaitExpression: (n: Node, children: { expression: Node }) => Node;
    reduceBinaryExpression: (
      n: Node,
      children: { left: Node; right: Node },
    ) => Node;
    reduceBindingIdentifier: (n: Node) => Node;
    reduceBindingPropertyIdentifier: (
      n: Node,
      children: { binding: Node; init?: Node },
    ) => Node;
    reduceBindingPropertyProperty: (
      n: Node,
      children: { name: Node; binding: Node },
    ) => Node;
    reduceBindingWithDefault: (
      n: Node,
      children: { binding: Node; init: Node },
    ) => Node;
    reduceBlock: (n: Node, children: { statements: Node[] }) => Node;
    reduceBlockStatement: (n: Node, children: { block: Node }) => Node;
    reduceBreakStatement: (n: Node) => Node;
    reduceCallExpression: (
      n: Node,
      children: { callee: Node; arguments: Node[] },
    ) => Node;
    reduceCatchClause: (
      n: Node,
      children: { binding: Node; body: Node },
    ) => Node;
    reduceClassDeclaration: (
      n: Node,
      children: { name: Node; super?: Node; elements: Node[] },
    ) => Node;
    reduceClassElement: (n: Node, children: { method: Node }) => Node;
    reduceClassExpression: (
      n: Node,
      children: { name?: Node; super?: Node; elements: Node[] },
    ) => Node;
    reduceCompoundAssignmentExpression: (
      n: Node,
      children: { binding: Node; expression: Node },
    ) => Node;
    reduceComputedMemberAssignmentTarget: (
      n: Node,
      children: { object: Node; expression: Node },
    ) => Node;
    reduceComputedMemberExpression: (
      n: Node,
      children: { object: Node; expression: Node },
    ) => Node;
    reduceComputedPropertyName: (
      n: Node,
      children: { expression: Node },
    ) => Node;
    reduceConditionalExpression: (
      n: Node,
      children: { test: Node; consequent: Node; alternate: Node },
    ) => Node;
    reduceContinueStatement: (n: Node) => Node;
    reduceDataProperty: (
      n: Node,
      children: { name: Node; expression: Node },
    ) => Node;
    reduceDebuggerStatement: (n: Node) => Node;
    reduceDirective: (n: Node) => Node;
    reduceDoWhileStatement: (
      n: Node,
      children: { body: Node; test: Node },
    ) => Node;
    reduceEmptyStatement: (n: Node) => Node;
    reduceExport: (n: Node, children: { declaration: Node }) => Node;
    reduceExportAllFrom: (n: Node) => Node;
    reduceExportDefault: (n: Node, children: { body: Node }) => Node;
    reduceExportFrom: (n: Node, children: { namedExports: Node[] }) => Node;
    reduceExportFromSpecifier: (n: Node) => Node;
    reduceExportLocalSpecifier: (n: Node, children: { name: Node }) => Node;
    reduceExportLocals: (n: Node, children: { namedExports: Node[] }) => Node;
    reduceExpressionStatement: (
      n: Node,
      children: { expression: Node },
    ) => Node;
    reduceForAwaitStatement: (
      n: Node,
      children: { left: Node; right: Node; body: Node },
    ) => Node;
    reduceForInStatement: (
      n: Node,
      children: { left: Node; right: Node; body: Node },
    ) => Node;
    reduceForOfStatement: (
      n: Node,
      children: { left: Node; right: Node; body: Node },
    ) => Node;
    reduceForStatement: (
      n: Node,
      children: { init?: Node; test?: Node; update?: Node; body: Node },
    ) => Node;
    reduceFormalParameters: (
      n: Node,
      children: { items: Node[]; rest?: Node },
    ) => Node;
    reduceFunctionBody: (
      n: Node,
      children: { directives: Node[]; statements: Node[] },
    ) => Node;
    reduceFunctionDeclaration: (
      n: Node,
      children: { name: Node; params: Node; body: Node },
    ) => Node;
    reduceFunctionExpression: (
      n: Node,
      children: { name?: Node; params: Node; body: Node },
    ) => Node;
    reduceGetter: (n: Node, children: { name: Node; body: Node }) => Node;
    reduceIdentifierExpression: (n: Node) => Node;
    reduceIfStatement: (
      n: Node,
      children: { test: Node; consequent: Node; alternate?: Node },
    ) => Node;
    reduceImport: (
      n: Node,
      children: { defaultBinding?: Node; namedImports: Node[] },
    ) => Node;
    reduceImportNamespace: (
      n: Node,
      children: { defaultBinding?: Node; namespaceBinding: Node },
    ) => Node;
    reduceImportSpecifier: (n: Node, children: { binding: Node }) => Node;
    reduceLabeledStatement: (n: Node, children: { body: Node }) => Node;
    reduceLiteralBooleanExpression: (n: Node) => Node;
    reduceLiteralInfinityExpression: (n: Node) => Node;
    reduceLiteralNullExpression: (n: Node) => Node;
    reduceLiteralNumericExpression: (n: Node) => Node;
    reduceLiteralRegExpExpression: (n: Node) => Node;
    reduceLiteralStringExpression: (n: Node) => Node;
    reduceMethod: (
      n: Node,
      children: { name: Node; params: Node; body: Node },
    ) => Node;
    reduceModule: (
      n: Node,
      children: { directives: Node[]; items: Node[] },
    ) => Node;
    reduceNewExpression: (
      n: Node,
      children: { callee: Node; arguments: Node[] },
    ) => Node;
    reduceNewTargetExpression: (n: Node) => Node;
    reduceObjectAssignmentTarget: (
      n: Node,
      children: { properties: Node[]; rest?: Node },
    ) => Node;
    reduceObjectBinding: (
      n: Node,
      children: { properties: Node[]; rest?: Node },
    ) => Node;
    reduceObjectExpression: (n: Node, children: { properties: Node[] }) => Node;
    reduceReturnStatement: (n: Node, children: { expression?: Node }) => Node;
    reduceScript: (
      n: Node,
      children: { directives: Node[]; statements: Node[] },
    ) => Node;
    reduceSetter: (
      n: Node,
      children: { name: Node; param: Node; body: Node },
    ) => Node;
    reduceShorthandProperty: (n: Node, children: { name: Node }) => Node;
    reduceSpreadElement: (n: Node, children: { expression: Node }) => Node;
    reduceSpreadProperty: (n: Node, children: { expression: Node }) => Node;
    reduceStaticMemberAssignmentTarget: (
      n: Node,
      children: { object: Node },
    ) => Node;
    reduceStaticMemberExpression: (n: Node, children: { object: Node }) => Node;
    reduceStaticPropertyName: (n: Node) => Node;
    reduceSuper: (n: Node) => Node;
    reduceSwitchCase: (
      n: Node,
      children: { test: Node; consequent: Node },
    ) => Node;
    reduceSwitchDefault: (n: Node, children: { consequent: Node }) => Node;
    reduceSwitchStatement: (
      n: Node,
      children: { discriminant: Node; cases: Node[] },
    ) => Node;
    reduceSwitchStatementWithDefault: (
      n: Node,
      children: {
        discriminant: Node;
        preDefaultCases: Node[];
        defaultCase: Node;
        postDefaultCases: Node[];
      },
    ) => Node;
    reduceTemplateElement: (n: Node) => Node;
    reduceTemplateExpression: (
      n: Node,
      children: { tag?: Node; elements: Node[] },
    ) => Node;
    reduceThisExpression: (n: Node) => Node;
    reduceThrowStatement: (n: Node, children: { expression?: Node }) => Node;
    reduceTryCatchStatement: (
      n: Node,
      children: { body: Node; catchClause: Node },
    ) => Node;
    reduceTryFinallyStatement: (
      n: Node,
      children: { body: Node; catchClause?: Node; finalizer: Node },
    ) => Node;
    reduceUnaryExpression: (n: Node, children: { operand: Node }) => Node;
    reduceUpdateExpression: (n: Node, children: { operand: Node }) => Node;
    reduceVariableDeclaration: (
      n: Node,
      children: { declarators: Node[] },
    ) => Node;
    reduceVariableDeclarationStatement: (
      n: Node,
      children: { declaration: Node },
    ) => Node;
    reduceVariableDeclarator: (
      n: Node,
      children: { binding: Node; init?: Node },
    ) => Node;
    reduceWhileStatement: (
      n: Node,
      children: { test: Node; body: Node },
    ) => Node;
    reduceWithStatement: (
      n: Node,
      children: { object: Node; body: Node },
    ) => Node;
    reduceYieldExpression: (n: Node, children: { expression?: Node }) => Node;
    reduceYieldGeneratorExpression: (
      n: Node,
      children: { expression: Node },
    ) => Node;
  }

  export interface ExtensibleReducer extends Reducer {
    constructor: () => ExtensibleReducer;
    parenToAvoidBeingDirective: (element: Node, original: Node) => Node;
    t: (token: unknown, isRegExp?: boolean) => unknown;
    p: (node: unknown, precedence: unknown, a: unknown) => unknown;
    getAssigmentExpr: (state: unknown) => unknown;
    paren: (
      rep: unknown,
      first: unknown,
      last: unknown,
      emptySep: unknown,
    ) => unknown;
    brace: (
      rep: unknown,
      node: unknown,
      first: unknown,
      last: unknown,
      emptySep: unknown,
    ) => unknown;
    bracket: (
      rep: unknown,
      node: unknown,
      first: unknown,
      last: unknown,
      emptySep: unknown,
    ) => unknown;
    commaSep: (pieces: unknown, before: unknown, after: unknown) => unknown;
    semiOp: () => unknown;
    sep: () => unknown;
  }
}
