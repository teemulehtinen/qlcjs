import { Node } from 'shift-ast';

const ifHas = (...nodes: (Node | null)[]) =>
  nodes.filter((n): n is Node => n !== null);

const children = (n: Node): Node[] => {
  switch (n.type) {
    case 'ArrayAssignmentTarget':
    case 'ArrayBinding':
      return ifHas(...n.elements, n.rest);
    case 'ArrayExpression':
      return ifHas(...n.elements);
    case 'ArrowExpression':
      return [n.params, n.body];
    case 'AssignmentExpression':
    case 'CompoundAssignmentExpression':
      return [n.binding, n.expression];
    case 'AssignmentTargetPropertyIdentifier':
    case 'AssignmentTargetWithDefault':
    case 'BindingPropertyIdentifier':
    case 'BindingWithDefault':
    case 'VariableDeclarator':
      return ifHas(n.binding, n.init);
    case 'AssignmentTargetPropertyProperty':
    case 'BindingPropertyProperty':
      return [n.name, n.binding];
    case 'AwaitExpression':
    case 'ComputedPropertyName':
    case 'ExpressionStatement':
    case 'ReturnStatement':
    case 'SpreadElement':
    case 'SpreadProperty':
    case 'ThrowStatement':
    case 'YieldExpression':
    case 'YieldGeneratorExpression':
      return ifHas(n.expression);
    case 'BinaryExpression':
      return [n.left, n.right];
    case 'Block':
      return n.statements;
    case 'BlockStatement':
      return [n.block];
    case 'CallExpression':
    case 'NewExpression':
      return [n.callee, ...n.arguments];
    case 'CatchClause':
      return [n.binding, n.body];
    case 'ClassDeclaration':
    case 'ClassExpression':
      return ifHas(n.name, n.super, ...n.elements);
    case 'ClassElement':
      return [n.method];
    case 'ComputedMemberAssignmentTarget':
    case 'ComputedMemberExpression':
      return [n.object, n.expression];
    case 'ConditionalExpression':
    case 'IfStatement':
      return ifHas(n.test, n.consequent, n.alternate);
    case 'DataProperty':
      return [n.name, n.expression];
    case 'DoWhileStatement':
      return [n.body, n.test];
    case 'Export':
      return [n.declaration];
    case 'ExportDefault':
    case 'LabeledStatement':
      return [n.body];
    case 'ExportFrom':
    case 'ExportLocals':
      return n.namedExports;
    case 'ExportLocalSpecifier':
    case 'ShorthandProperty':
      return [n.name];
    case 'ForAwaitStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
      return [n.left, n.right, n.body];
    case 'ForStatement':
      return ifHas(n.init, n.test, n.update, n.body);
    case 'FormalParameters':
      return ifHas(...n.items, n.rest);
    case 'FunctionBody':
    case 'Script':
      return [...n.directives, ...n.statements];
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'Method':
      return ifHas(n.name, n.params, n.body);
    case 'Getter':
      return [n.name, n.body];
    case 'Import':
      return ifHas(n.defaultBinding, ...n.namedImports);
    case 'ImportNamespace':
      return ifHas(n.defaultBinding, n.namespaceBinding);
    case 'ImportSpecifier':
      return [n.binding];
    case 'Module':
      return [...n.directives, ...n.items];
    case 'ObjectAssignmentTarget':
    case 'ObjectBinding':
      return ifHas(...n.properties, n.rest);
    case 'ObjectExpression':
      return n.properties;
    case 'Setter':
      return [n.name, n.param, n.body];
    case 'StaticMemberAssignmentTarget':
    case 'StaticMemberExpression':
      return [n.object];
    case 'SwitchCase':
      return [n.test, ...n.consequent];
    case 'SwitchDefault':
      return n.consequent;
    case 'SwitchStatement':
      return [n.discriminant, ...n.cases];
    case 'SwitchStatementWithDefault':
      return [
        n.discriminant,
        ...n.preDefaultCases,
        n.defaultCase,
        ...n.postDefaultCases,
      ];
    case 'TemplateExpression':
      return ifHas(n.tag, ...n.elements);
    case 'TryCatchStatement':
      return [n.body, n.catchClause];
    case 'TryFinallyStatement':
      return ifHas(n.body, n.catchClause, n.finalizer);
    case 'UnaryExpression':
    case 'UpdateExpression':
      return [n.operand];
    case 'VariableDeclaration':
      return n.declarators;
    case 'VariableDeclarationStatement':
      return [n.declaration];
    case 'WhileStatement':
      return [n.test, n.body];
    case 'WithStatement':
      return [n.object, n.body];
    default:
      return [];
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

export default children;
