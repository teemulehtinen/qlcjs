import { Node } from 'shift-ast';

export type Transformer = (node: Node, stack: Node[]) => Node;

type RecursiveTransform = <T extends Node>(
  node: T,
  stack: Node[],
  tr: Transformer,
) => T;

const rIf = <C extends Node>(
  n: C | null,
  s: Node[],
  r: RecursiveTransform,
  tr: Transformer,
) => (n === null ? null : r(n, s, tr));

const rMapIf = <C extends Node>(
  es: (C | null)[],
  s: Node[],
  r: RecursiveTransform,
  tr: Transformer,
) => es.map(e => rIf(e, s, r, tr));

const rMap = <C extends Node>(
  es: C[],
  s: Node[],
  r: RecursiveTransform,
  tr: Transformer,
) => es.map(e => r(e, s, tr));

const transformChildren = <T extends Node>(
  node: T,
  stack: Node[],
  r: RecursiveTransform,
  tr: Transformer,
): T => {
  const newStack = stack.concat(node);
  switch (node.type) {
    case 'ArrayAssignmentTarget':
      return {
        ...node,
        elements: rMapIf(node.elements, newStack, r, tr),
        rest: rIf(node.rest, newStack, r, tr),
      };
    case 'ArrayBinding':
      return {
        ...node,
        elements: rMapIf(node.elements, newStack, r, tr),
        rest: rIf(node.rest, newStack, r, tr),
      };
    case 'ArrayExpression':
      return {
        ...node,
        elements: rMapIf(node.elements, newStack, r, tr),
      };
    case 'ArrowExpression':
      return {
        ...node,
        params: r(node.params, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'AssignmentExpression':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        expression: r(node.expression, newStack, tr),
      };
    case 'CompoundAssignmentExpression':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        expression: r(node.expression, newStack, tr),
      };
    case 'AssignmentTargetPropertyIdentifier':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        init: rIf(node.init, newStack, r, tr),
      };
    case 'BindingPropertyIdentifier':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        init: rIf(node.init, newStack, r, tr),
      };
    case 'VariableDeclarator':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        init: rIf(node.init, newStack, r, tr),
      };
    case 'AssignmentTargetWithDefault':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        init: r(node.init, newStack, tr),
      };
    case 'BindingWithDefault':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        init: r(node.init, newStack, tr),
      };
    case 'AssignmentTargetPropertyProperty':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        binding: r(node.binding, newStack, tr),
      };
    case 'BindingPropertyProperty':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        binding: r(node.binding, newStack, tr),
      };
    case 'AwaitExpression':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'ComputedPropertyName':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'ExpressionStatement':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'SpreadElement':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'SpreadProperty':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'ThrowStatement':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'YieldGeneratorExpression':
      return {
        ...node,
        expression: r(node.expression, newStack, tr),
      };
    case 'ReturnStatement':
      return {
        ...node,
        expression: rIf(node.expression, newStack, r, tr),
      };
    case 'YieldExpression':
      return {
        ...node,
        expression: rIf(node.expression, newStack, r, tr),
      };
    case 'BinaryExpression':
      return {
        ...node,
        left: r(node.left, newStack, tr),
        right: r(node.right, newStack, tr),
      };
    case 'Block':
      return {
        ...node,
        statements: rMap(node.statements, newStack, r, tr),
      };
    case 'BlockStatement':
      return {
        ...node,
        block: r(node.block, newStack, tr),
      };
    case 'CallExpression':
      return {
        ...node,
        callee: r(node.callee, newStack, tr),
        arguments: rMap(node.arguments, newStack, r, tr),
      };
    case 'NewExpression':
      return {
        ...node,
        callee: r(node.callee, newStack, tr),
        arguments: rMap(node.arguments, newStack, r, tr),
      };
    case 'CatchClause':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'ClassDeclaration':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        super: rIf(node.super, newStack, r, tr),
        elements: rMap(node.elements, newStack, r, tr),
      };
    case 'ClassExpression':
      return {
        ...node,
        name: rIf(node.name, newStack, r, tr),
        super: rIf(node.super, newStack, r, tr),
        elements: rMap(node.elements, newStack, r, tr),
      };
    case 'ClassElement':
      return {
        ...node,
        method: r(node.method, newStack, tr),
      };
    case 'ComputedMemberAssignmentTarget':
      return {
        ...node,
        object: r(node.object, newStack, tr),
        expression: r(node.expression, newStack, tr),
      };
    case 'ComputedMemberExpression':
      return {
        ...node,
        object: r(node.object, newStack, tr),
        expression: r(node.expression, newStack, tr),
      };
    case 'ConditionalExpression':
      return {
        ...node,
        test: r(node.test, newStack, tr),
        consequent: r(node.consequent, newStack, tr),
        alternate: r(node.alternate, newStack, tr),
      };
    case 'IfStatement':
      return {
        ...node,
        test: r(node.test, newStack, tr),
        consequent: r(node.consequent, newStack, tr),
        alternate: rIf(node.alternate, newStack, r, tr),
      };
    case 'DataProperty':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        expression: r(node.expression, newStack, tr),
      };
    case 'DoWhileStatement':
      return {
        ...node,
        body: r(node.body, newStack, tr),
        test: r(node.test, newStack, tr),
      };
    case 'Export':
      return {
        ...node,
        declaration: r(node.declaration, newStack, tr),
      };
    case 'ExportDefault':
      return {
        ...node,
        body: r(node.body, newStack, tr),
      };
    case 'LabeledStatement':
      return {
        ...node,
        body: r(node.body, newStack, tr),
      };
    case 'ExportFrom':
      return {
        ...node,
        namedExports: rMap(node.namedExports, newStack, r, tr),
      };
    case 'ExportLocals':
      return {
        ...node,
        namedExports: rMap(node.namedExports, newStack, r, tr),
      };
    case 'ExportLocalSpecifier':
      return {
        ...node,
        name: r(node.name, newStack, tr),
      };
    case 'ShorthandProperty':
      return {
        ...node,
        name: r(node.name, newStack, tr),
      };
    case 'ForAwaitStatement':
      return {
        ...node,
        left: r(node.left, newStack, tr),
        right: r(node.right, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'ForInStatement':
      return {
        ...node,
        left: r(node.left, newStack, tr),
        right: r(node.right, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'ForOfStatement':
      return {
        ...node,
        left: r(node.left, newStack, tr),
        right: r(node.right, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'ForStatement':
      return {
        ...node,
        init: rIf(node.init, newStack, r, tr),
        test: rIf(node.test, newStack, r, tr),
        update: rIf(node.update, newStack, r, tr),
        body: r(node.body, newStack, tr),
      };
    case 'FormalParameters':
      return {
        ...node,
        items: rMap(node.items, newStack, r, tr),
        rest: rIf(node.rest, newStack, r, tr),
      };
    case 'FunctionBody':
      return {
        ...node,
        directives: rMap(node.directives, newStack, r, tr),
        statements: rMap(node.statements, newStack, r, tr),
      };
    case 'Script':
      return {
        ...node,
        directives: rMap(node.directives, newStack, r, tr),
        statements: rMap(node.statements, newStack, r, tr),
      };
    case 'FunctionDeclaration':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        params: r(node.params, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'Method':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        params: r(node.params, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'FunctionExpression':
      return {
        ...node,
        name: rIf(node.name, newStack, r, tr),
        params: r(node.params, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'Getter':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'Import':
      return {
        ...node,
        defaultBinding: rIf(node.defaultBinding, newStack, r, tr),
        namedImports: rMap(node.namedImports, newStack, r, tr),
      };
    case 'ImportNamespace':
      return {
        ...node,
        defaultBinding: rIf(node.defaultBinding, newStack, r, tr),
        namespaceBinding: r(node.namespaceBinding, newStack, tr),
      };
    case 'ImportSpecifier':
      return {
        ...node,
        binding: r(node.binding, newStack, tr),
      };
    case 'Module':
      return {
        ...node,
        directives: rMap(node.directives, newStack, r, tr),
        items: rMap(node.items, newStack, r, tr),
      };
    case 'ObjectAssignmentTarget':
      return {
        ...node,
        properties: rMap(node.properties, newStack, r, tr),
        rest: rIf(node.rest, newStack, r, tr),
      };
    case 'ObjectBinding':
      return {
        ...node,
        properties: rMap(node.properties, newStack, r, tr),
        rest: rIf(node.rest, newStack, r, tr),
      };
    case 'ObjectExpression':
      return {
        ...node,
        properties: rMap(node.properties, newStack, r, tr),
      };
    case 'Setter':
      return {
        ...node,
        name: r(node.name, newStack, tr),
        param: r(node.param, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'StaticMemberAssignmentTarget':
      return {
        ...node,
        object: r(node.object, newStack, tr),
      };
    case 'StaticMemberExpression':
      return {
        ...node,
        object: r(node.object, newStack, tr),
      };
    case 'SwitchCase':
      return {
        ...node,
        test: r(node.test, newStack, tr),
        consequent: rMap(node.consequent, newStack, r, tr),
      };
    case 'SwitchDefault':
      return {
        ...node,
        consequent: rMap(node.consequent, newStack, r, tr),
      };
    case 'SwitchStatement':
      return {
        ...node,
        discriminant: r(node.discriminant, newStack, tr),
        cases: rMap(node.cases, newStack, r, tr),
      };
    case 'SwitchStatementWithDefault':
      return {
        ...node,
        discriminant: r(node.discriminant, newStack, tr),
        preDefaultCases: rMap(node.preDefaultCases, newStack, r, tr),
        defaultCase: r(node.defaultCase, newStack, tr),
        postDefaultCases: rMap(node.postDefaultCases, newStack, r, tr),
      };
    case 'TemplateExpression':
      return {
        ...node,
        tag: rIf(node.tag, newStack, r, tr),
        elements: rMap(node.elements, newStack, r, tr),
      };
    case 'TryCatchStatement':
      return {
        ...node,
        body: r(node.body, newStack, tr),
        catchClause: r(node.catchClause, newStack, tr),
      };
    case 'TryFinallyStatement':
      return {
        ...node,
        body: r(node.body, newStack, tr),
        catchClause: rIf(node.catchClause, newStack, r, tr),
        finalizer: r(node.finalizer, newStack, tr),
      };
    case 'UnaryExpression':
      return {
        ...node,
        operand: r(node.operand, newStack, tr),
      };
    case 'UpdateExpression':
      return {
        ...node,
        operand: r(node.operand, newStack, tr),
      };
    case 'VariableDeclaration':
      return {
        ...node,
        declarators: rMap(node.declarators, newStack, r, tr),
      };
    case 'VariableDeclarationStatement':
      return {
        ...node,
        declaration: r(node.declaration, newStack, tr),
      };
    case 'WhileStatement':
      return {
        ...node,
        test: r(node.test, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    case 'WithStatement':
      return {
        ...node,
        object: r(node.object, newStack, tr),
        body: r(node.body, newStack, tr),
      };
    default:
      return node;
    // case 'AssignmentTargetIdentifier':
    // case 'BindingIdentifier':
    // case 'BreakStatement':
    // case 'ContinueStatement':
    // case 'DebuggerStatement':
    // case 'Directive':
    // case 'EmptyStatement':
    // case 'ExportAllFrom':
    // case 'ExportFromSpecifier':
    // case 'IdentifierExpression':
    // case 'LiteralBooleanExpression':
    // case 'LiteralInfinityExpression':
    // case 'LiteralNullExpression':
    // case 'LiteralNumericExpression':
    // case 'LiteralRegExpExpression':
    // case 'LiteralStringExpression':
    // case 'NewTargetExpression':
    // case 'StaticPropertyName':
    // case 'Super':
    // case 'TemplateElement':
    // case 'ThisExpression':
  }
};

export default transformChildren;
