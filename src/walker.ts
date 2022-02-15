import { Node } from 'estree';

export type NodeListener = (node: Node) => void;

const ifHaving = (...nodes: (Node | undefined | null)[]): Node[] =>
  nodes.filter((n): n is Node => n !== undefined && n !== null);

export const children = (node: Node): Node[] => {
  switch (node.type) {
    case 'Program':
    case 'BlockStatement':
    case 'StaticBlock':
    case 'ClassBody':
      return node.body;
    case 'ExpressionStatement':
    case 'ChainExpression':
      return [node.expression];
    case 'IfStatement':
    case 'ConditionalExpression':
      return ifHaving(node.test, node.consequent, node.alternate);
    case 'LabeledStatement':
      return [node.label, node.body];
    case 'BreakStatement':
    case 'ContinueStatement':
      return ifHaving(node.label);
    case 'WithStatement':
      return [node.object, node.body];
    case 'SwitchStatement':
      return [node.discriminant as Node].concat(node.cases);
    case 'ReturnStatement':
    case 'ThrowStatement':
      return ifHaving(node.argument);
    case 'TryStatement':
      return ifHaving(node.block, node.handler, node.finalizer);
    case 'WhileStatement':
    case 'DoWhileStatement':
      return [node.test, node.body];
    case 'ForStatement':
      return ifHaving(node.init, node.test, node.update, node.body);
    case 'ForInStatement':
      return ifHaving(node.left, node.right, node.body);
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      return ifHaving(node.id).concat(node.params).concat(node.body);
    case 'VariableDeclaration':
      return node.declarations;
    case 'VariableDeclarator':
      return ifHaving(node.id, node.init);
    case 'ArrayExpression':
    case 'ArrayPattern':
      return ifHaving(...node.elements);
    case 'ObjectExpression':
      return node.properties;
    case 'Property':
      return [node.key, node.value];
    case 'PropertyDefinition':
      return ifHaving(node.key, node.value);
    case 'SequenceExpression':
      return node.expressions;
    case 'UnaryExpression':
    case 'UpdateExpression':
    case 'RestElement':
      return [node.argument];
    case 'BinaryExpression':
    case 'AssignmentExpression':
    case 'LogicalExpression':
    case 'AssignmentPattern':
      return [node.left, node.right];
    case 'CallExpression':
    case 'NewExpression':
      return [node.callee as Node].concat(node.arguments);
    case 'MemberExpression':
      return [node.object, node.property];
    case 'SwitchCase':
      return ifHaving(node.test).concat(node.consequent);
    case 'CatchClause':
      return ifHaving(node.param, node.body);
    case 'SpreadElement':
    case 'YieldExpression':
      return ifHaving(node.argument);
    case 'ArrowFunctionExpression':
      return (node.params as Node[]).concat(node.body);
    case 'TemplateLiteral':
      return (node.quasis as Node[]).concat(node.expressions);
    case 'TaggedTemplateExpression':
      return [node.tag, node.quasi];
    case 'ObjectPattern':
      return node.properties;
    case 'MethodDefinition':
      return [node.key, node.value];
    case 'ClassDeclaration':
      return ifHaving(node.id, node.superClass, node.body);
    case 'MetaProperty':
      return [node.meta, node.property];
    case 'ImportDeclaration':
      return (node.specifiers as Node[]).concat(node.source);
    case 'ImportSpecifier':
      return [node.local, node.imported];
    case 'ImportExpression':
      return [node.source];
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier':
      return [node.local];
    case 'ExportNamedDeclaration':
      return ifHaving(node.declaration)
        .concat(node.specifiers)
        .concat(ifHaving(node.source));
    case 'ExportSpecifier':
      return [node.local, node.exported];
    case 'ExportDefaultDeclaration':
      return [node.declaration];
    case 'ExportAllDeclaration':
      return ifHaving(node.exported, node.source);
    default:
      return [];
  }
};

export const walk = (
  node: Node,
  enter?: NodeListener,
  leave?: NodeListener,
) => {
  if (enter) {
    enter(node);
  }
  children(node).forEach(child => walk(child, enter, leave));
  if (leave) {
    leave(node);
  }
};
