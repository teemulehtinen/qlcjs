import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as mod from '../src';
import { BLA_CODE, TINY_FUNCTIONS } from './test-code';

const API = suite('exports');

API('should export an object', () => {
  assert.type(mod, 'object');
});

API.run();

// ---

const functionName = suite('FunctionName');

functionName('should detect different functions', () => {
  const qlcs = mod.generate(TINY_FUNCTIONS, [
    { count: 10, types: ['FunctionName'] },
  ]);
  assert.is(qlcs.length, 4);
  assert.equal(
    new Set(
      qlcs.flatMap(q => q.options.filter(o => o.correct).map(o => o.answer)),
    ),
    new Set(['plusTwo', 'summer', 'nested', 'b']),
  );
});

functionName('should generate requested distractors', () => {
  const qlcs = mod.generate(BLA_CODE, [{ count: 1, types: ['FunctionName'] }]);
  assert.is(qlcs.length, 1);
  const answers = qlcs[0].options.map(o => o.answer);
  assert.is(answers.length, 5);
  ['bla', 'function', 'n', 'repeated'].forEach(a =>
    assert.ok(answers.includes(a)),
  );
  assert.ok(answers.includes('const') || answers.includes('return'));
});

functionName.run();

// ---
