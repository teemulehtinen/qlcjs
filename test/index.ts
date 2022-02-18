import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as mod from '../src';
import { splitCorrectAndDistractors, overlaps, getCorrect } from './help';
import { BLA_CODE, TINY_FUNCTIONS } from './test-code';

const API = suite('exports');

API('should export an object', () => {
  assert.type(mod, 'object');
});

API('should generate different question types', () => {
  const qlcs = mod.generate(TINY_FUNCTIONS, [{ count: 10, uniqueTypes: true }]);
  const types = qlcs.map(q => q.type);
  assert.is([...new Set(types)].length, types.length);
  assert.ok(types.length > 1);
});

API.run();

// ---

const functionName = suite('FunctionName');

functionName('should detect different functions', () => {
  const qlcs = mod.generate(TINY_FUNCTIONS, [
    { count: 10, types: ['FunctionName'] },
  ]);
  assert.equal(getCorrect(qlcs), ['b', 'nested', 'plusTwo', 'summer']);
});

functionName('should generate distractors', () => {
  const { correct, distractors } = splitCorrectAndDistractors(
    mod.generate(BLA_CODE, [{ count: 1, types: ['FunctionName'] }])[0],
  );
  assert.equal(correct, ['bla']);
  assert.ok(
    overlaps(distractors, ['function', 'n', 'repeated', 'const', 'return']),
  );
});

functionName.run();

// ---

const parameterName = suite('ParameterName');

parameterName('should detect different parameters', () => {
  const qlcs = mod.generate(TINY_FUNCTIONS, [
    { count: 10, types: ['ParameterName'] },
  ]);
  assert.equal(getCorrect(qlcs), ['a', 'b', 'i', 'n']);
});

parameterName('should generate distractors', () => {
  const { correct, distractors } = splitCorrectAndDistractors(
    mod.generate(BLA_CODE, [{ count: 1, types: ['ParameterName'] }])[0],
  );
  assert.equal(correct, ['n']);
  assert.ok(
    overlaps(distractors, ['bla', 'function', 'repeated', 'const', 'return']),
  );
});

parameterName.run();
