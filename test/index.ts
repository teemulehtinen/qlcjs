import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as qlcjs from '../src';
import { HALVE_ARROW_FUN, HALVE_FUN } from './test-code';

const API = suite('exports');

API('should export an object', () => {
  assert.type(qlcjs, 'object');
});

API.run();

// ---

const functionName = suite('FunctionName');

functionName('should detect function', () => {
  const qlcs = qlcjs.generate(HALVE_FUN, [
    { count: 1, types: ['FunctionName'] },
  ]);
  assert.is(qlcs.length, 1);
  console.log(qlcs[0]);
});

functionName('should detect arrow function', () => {
  const qlcs = qlcjs.generate(HALVE_ARROW_FUN, [
    { count: 1, types: ['FunctionName'] },
  ]);
  console.log(qlcs);
});

functionName.run();
