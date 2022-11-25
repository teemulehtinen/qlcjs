import { ArrayRequest } from '../helpers/arrays';
import { QLCOption } from '../types';
declare type Answer = string | number | (string | number)[];
export declare const options: (answers: Answer, type: string, info?: string | undefined, correct?: boolean | undefined) => ArrayRequest<QLCOption>;
export declare const randomOptions: (count: number, answers: () => string | number | (string | number)[], type: string, info?: string | undefined) => ArrayRequest<QLCOption>;
export declare const fillRandomOptions: (count: number, answers: () => string | number | (string | number)[], type: string, info?: string | undefined) => ArrayRequest<QLCOption>;
export declare const pickOptions: (...requests: (ArrayRequest<QLCOption> | undefined)[]) => QLCOption[];
export {};
