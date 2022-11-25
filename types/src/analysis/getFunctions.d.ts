import { ArrowExpression, FormalParameters, FunctionExpression, Node } from 'shift-ast';
import { Scope } from 'shift-scope';
import { FunctionWithVariables } from '../types';
export declare const isFunctionExpression: (node: Node) => node is ArrowExpression | FunctionExpression;
export declare const searchFunctionVariables: (root: Node) => Map<ArrowExpression | FunctionExpression, string>;
export declare const getFunctionsWithVariables: (global: Scope, root: Node) => FunctionWithVariables[];
export declare const getParameterNames: (params: FormalParameters) => string[];
