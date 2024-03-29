export declare const range: (b: number, e: number) => number[];
export declare const asArray: <T>(input: T | T[]) => T[];
export declare const shuffle: <T>(input: T[]) => T[];
export declare const pick: <T>(input: T[], n?: number | undefined) => T[];
export declare const pickIndex: <T>(input: T[]) => number;
export declare const pickOne: <T>(input: T[]) => T | undefined;
export declare const notIn: <T>(input: T[], not: T[], key: (e: T) => string) => T[];
export declare type ArrayRequest<T> = [T[] | (() => T[]), number?, boolean?];
export declare const pickFrom: <T>(key: (e: T) => string, ...requests: ArrayRequest<T>[]) => T[];
export declare const sortNumberOrString: (a: number | string, b: number | string) => number;
