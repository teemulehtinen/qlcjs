import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as qlcjs from '../src';
import { TINY_FUN } from './test-code';

const API = suite('exports');

API('should export an object', () => {
  assert.type(qlcjs, 'object');
});

API.run();

// ---

const functionName = suite('FunctionName');

functionName('should detect function', () => {
  const qlcs = qlcjs.generate(TINY_FUN, [
    { count: 10, types: ['FunctionName'] },
  ]);
  // assert.is(qlcs.length, 1);
  console.log(qlcs[0]);
});

functionName.run();
