import { Node } from 'shift-ast';
import { Scope, Variable } from 'shift-scope';
import { SimpleValue } from '../helpers/simpleValues';
export interface RecordableVariable extends Variable {
    index: number;
    writes: Node[];
    recorded: Node[];
}
export declare const transformToRecorded: (root: Node, global: Scope) => {
    tree: Node;
    script: string;
    variables: RecordableVariable[];
};
export declare const evaluateRecorded: (script: string, functionName?: string | undefined, functionArguments?: SimpleValue[] | undefined) => {
    [k: string]: SimpleValue[];
};
export declare const recordVariableHistory: (root: Node, global: Scope, functionName?: string | undefined, functionArguments?: SimpleValue[] | undefined) => {
    arguments: SimpleValue[] | undefined;
    variables: RecordableVariable[];
    history: {
        [k: string]: SimpleValue[];
    };
};
