import {
  AssignmentExpression,
  AssignmentTargetIdentifier,
  BinaryExpression,
  CompoundAssignmentExpression,
  ComputedMemberAssignmentTarget,
  ComputedMemberExpression,
  IdentifierExpression,
  StaticMemberAssignmentTarget,
  StaticMemberExpression,
} from 'shift-ast';

type COMPOUND_OPS =
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '**='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&=';

type REQUIRED_BINARY_OPS =
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '**'
  | '<<'
  | '>>'
  | '>>>'
  | '|'
  | '^'
  | '&';

const COMPOUND_TO_BINARY: { [o in COMPOUND_OPS]: REQUIRED_BINARY_OPS } = {
  '+=': '+',
  '-=': '-',
  '*=': '*',
  '/=': '/',
  '%=': '%',
  '**=': '**',
  '<<=': '<<',
  '>>=': '>>',
  '>>>=': '>>>',
  '|=': '|',
  '^=': '^',
  '&=': '&',
};

export const unpackAssignmentIdentifier = (
  binding:
    | AssignmentTargetIdentifier
    | ComputedMemberAssignmentTarget
    | StaticMemberAssignmentTarget,
) => {
  switch (binding.type) {
    case 'AssignmentTargetIdentifier':
      return new IdentifierExpression({ name: binding.name });
    case 'ComputedMemberAssignmentTarget':
      return new ComputedMemberExpression({
        object: binding.object,
        expression: binding.expression,
      });
    case 'StaticMemberAssignmentTarget':
      return new StaticMemberExpression({
        object: binding.object,
        property: binding.property,
      });
    default:
      return new IdentifierExpression({ name: '__never' });
  }
};

export const unpackCompoundExpression = (
  compound: CompoundAssignmentExpression,
) =>
  new BinaryExpression({
    left: unpackAssignmentIdentifier(compound.binding),
    operator: COMPOUND_TO_BINARY[compound.operator],
    right: compound.expression,
  });

export const unpackCompoundAssignment = (
  compound: CompoundAssignmentExpression,
) =>
  new AssignmentExpression({
    binding: compound.binding,
    expression: unpackCompoundExpression(compound),
  });
