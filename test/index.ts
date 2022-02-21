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
  const qlc = mod.generate(BLA_CODE, [
    { count: 1, types: ['FunctionName'] },
  ])[0];
  const { correct, distractors } = splitCorrectAndDistractors(qlc);
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
  const qlc = mod.generate(BLA_CODE, [
    { count: 1, types: ['ParameterName'] },
  ])[0];
  const { correct, distractors } = splitCorrectAndDistractors(qlc);
  assert.equal(correct, ['n']);
  assert.ok(
    overlaps(distractors, ['bla', 'function', 'repeated', 'const', 'return']),
  );
});

parameterName.run();

// ---

const parameterValue = suite('ParameterValue');

parameterValue('should generate answers to match description', () => {
  const qlc = mod.generate(
    BLA_CODE,
    [{ count: 1, types: ['ParameterValue'] }],
    [{ functionName: 'bla', parameters: [[1], [2], [3], [4], [5]] }],
  )[0];
  const { correct, distractors } = splitCorrectAndDistractors(qlc);
  assert.ok(qlc.question.includes(`${correct[0]}`));
  assert.ok(overlaps(correct, [1, 2, 3, 4, 5]));
  assert.ok(distractors.includes('"bla "'));
});

parameterValue.run();

// ---

const loopEnd = suite('LoopEnd');

loopEnd('should detect loop lines', () => {
  const qlc = mod.generate(BLA_CODE, [{ count: 1, types: ['LoopEnd'] }])[0];
  const { correct, distractors } = splitCorrectAndDistractors(qlc);
  assert.equal(correct, [10]);
  assert.ok(distractors.length > 0);
});

loopEnd.run();

// ---

const variableDeclaration = suite('VariableDeclaration');

variableDeclaration('should detect different variables', () => {
  const qlcs = mod.generate(TINY_FUNCTIONS, [
    { count: 10, types: ['VariableDeclaration'] },
  ]);
  assert.equal(getCorrect(qlcs), [10, 3]);
});

variableDeclaration('should generate distractors', () => {
  const qlcs = mod.generate(BLA_CODE, [
    { count: 10, types: ['VariableDeclaration'] },
  ]);
  const qlci = qlcs.find(
    q => q.options.find(o => o.correct && o.answer === 6) !== undefined,
  );
  assert.ok(qlci !== undefined);
  assert.ok(
    overlaps(
      [7, 8, 10],
      qlci.options.map(o => o.answer),
    ),
  );
});

variableDeclaration.run();
