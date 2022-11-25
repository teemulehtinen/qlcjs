import { ArrowExpression, FunctionDeclaration, FunctionExpression, Node, Script } from 'shift-ast';
import { Comment, LocationMap } from 'shift-parser';
import { Scope, Variable } from 'shift-scope';
import { RecordableVariable } from './executor';
import { SimpleValue } from './helpers/simpleValues';
export declare const isNode: <T extends Node>(node: Node, types: string[]) => node is T;
export interface QLCTyped {
    type: QLCType;
}
export interface QLCTemplate extends QLCTyped {
    prepare: QLCPrepararer;
    wantsFunctions?: boolean;
    wantsRecordedEvaluation?: boolean;
}
export declare type QLCPrepararer = (model: ProgramModel) => QLCGenerator[];
export interface QLCPrepared extends QLCTyped {
    pos: number;
    generate: QLCGenerator;
}
export interface ProgramModel {
    tree: Script;
    locations: LocationMap;
    comments: Comment[];
    scope: Scope;
    input?: ProgramInput;
    functions?: FunctionWithVariables[];
    recorded?: {
        variables: RecordableVariable[];
        history: {
            [k: string]: SimpleValue[];
        };
        arguments?: SimpleValue[];
    };
}
export interface ProgramInput {
    functionName: string;
    arguments: SimpleValue[][];
}
export interface FunctionWithVariables {
    name: string;
    astNode: FunctionDeclaration | ArrowExpression | FunctionExpression;
    variables: Variable[];
}
export declare type QLCGenerator = () => QLCBase;
export interface QLCBase {
    question: string;
    options: QLCOption[];
}
export interface QLCOption {
    type: string;
    answer: string | number;
    correct?: boolean;
    info?: string;
}
export interface QLC extends QLCTyped, QLCBase {
    pos: number;
}
export declare type QLCType = 'FunctionName' | 'ParameterName' | 'ParameterValue' | 'LoopEnd' | 'VariableDeclaration' | 'MethodCall' | 'VariableTrace';
