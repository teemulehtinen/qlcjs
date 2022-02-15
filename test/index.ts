import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as qlcjs from '../src';
import { HALVE_FUN } from './test-code';

const API = suite('exports');

API('should export an object', () => {
  assert.type(qlcjs, 'object');
});

API.run();

// ---

const functionName = suite('FunctionName');

functionName('should detect function', () => {
  const r = qlcjs.generate(HALVE_FUN);
  console.log(r[0]);
  console.log(r[0].qlcs[0].options);
  assert.is(r.length, 1);
});

functionName.run();
