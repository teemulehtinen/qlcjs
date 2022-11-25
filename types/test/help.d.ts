import { QLC } from '../src';
export declare const getCorrect: (qlcs: QLC[]) => (string | number)[];
export declare const splitCorrectAndDistractors: (qlc: QLC) => {
    correct: (string | number)[];
    distractors: (string | number)[];
};
export declare const overlaps: (test: (string | number)[], cover: (string | number)[]) => boolean;
