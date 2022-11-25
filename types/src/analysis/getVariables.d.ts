import { LocationMap } from 'shift-parser';
import { Declaration, Reference, Scope, Variable } from 'shift-scope';
export declare const getVariables: (global: Scope, declarationTypes?: string[] | undefined) => Variable[];
export declare const VariableDeclarations: string[];
export declare const ParameterDeclarations: string[];
export declare const FunctionDeclarations: string[];
export interface VariableReferences extends Variable {
    declaration: DeclarationWithLine;
    reads: ReferenceWithLine[];
    writes: ReferenceWithLine[];
}
export interface DeclarationWithLine extends Declaration {
    line: number;
}
export interface ReferenceWithLine extends Reference {
    line: number;
}
export declare const parseReferences: (variables: Variable[], locations: LocationMap, requireDifferentLine?: boolean | undefined) => VariableReferences[];
