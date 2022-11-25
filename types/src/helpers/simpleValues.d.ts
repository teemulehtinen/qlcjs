export declare type SimpleValue = boolean | number | string | boolean[] | number[] | string[];
export declare const simpleToProgram: (v: SimpleValue) => string | number;
export declare const formatSimpleList: (v: SimpleValue[]) => string;
export declare const smaller: (v: SimpleValue) => SimpleValue;
export declare const larger: (v: SimpleValue) => SimpleValue;
export declare const next: (vs: SimpleValue[]) => SimpleValue;
