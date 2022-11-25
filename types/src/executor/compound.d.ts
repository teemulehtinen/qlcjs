import { AssignmentExpression, AssignmentTargetIdentifier, BinaryExpression, CompoundAssignmentExpression, ComputedMemberAssignmentTarget, ComputedMemberExpression, IdentifierExpression, StaticMemberAssignmentTarget, StaticMemberExpression } from 'shift-ast';
export declare const unpackAssignmentIdentifier: (binding: AssignmentTargetIdentifier | ComputedMemberAssignmentTarget | StaticMemberAssignmentTarget) => IdentifierExpression | ComputedMemberExpression | StaticMemberExpression;
export declare const unpackCompoundExpression: (compound: CompoundAssignmentExpression) => BinaryExpression;
export declare const unpackCompoundAssignment: (compound: CompoundAssignmentExpression) => AssignmentExpression;
