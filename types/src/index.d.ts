import { ProgramModel, QLC, QLCPrepared, QLCType, ProgramInput } from './types';
export { QLC, QLCType, QLCPrepared, ProgramInput, ProgramModel } from './types';
export { SimpleValue } from './helpers/simpleValues';
export { qlcToText, qlcsToText } from './format';
export { transformToRecorded, evaluateRecorded } from './executor';
export declare const createProgramModel: (source: string, input?: ProgramInput | undefined, getFunctions?: boolean | undefined, recordEvaluation?: boolean | undefined) => ProgramModel;
export declare const prepare: (source: string, select?: QLCType[] | undefined, input?: ProgramInput | undefined) => QLCPrepared[];
export interface QLCRequest {
    count: number;
    fill?: boolean;
    types?: QLCType[];
    uniqueTypes?: boolean;
}
export declare const generate: (source: string, requests?: QLCRequest[] | undefined, input?: ProgramInput | undefined) => QLC[];
