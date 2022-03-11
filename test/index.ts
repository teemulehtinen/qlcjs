import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as mod from '../src';
import { splitCorrectAndDistractors, overlaps, getCorrect } from './help';
import { BLA_CODE, FOR_CODE, TINY_FUNCTIONS, WHILE_CODE } from './test-code';

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

API('should generate nice texts', () => {
  const text = mod.qlcsToText(
    mod.generate(FOR_CODE, [{ count: 10, uniqueTypes: true }], {
      functionName: 'power',
      arguments: [
        [2, 1],
        [2, 2],
      ],
    }),
    true,
    true,
  );
  assert.ok(text.includes('Which'));
  // console.log(text);
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
    { functionName: 'bla', arguments: [[1], [2], [3], [4], [5]] },
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
  assert.equal(correct, [11]);
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
      [7, 8, 9, 11],
      qlci.options.map(o => o.answer),
    ),
  );
});

variableDeclaration.run();

// ---

const methodCall = suite('MethodCall');

methodCall('should detect method calls', () => {
  const qlcs = mod.generate(BLA_CODE, [{ count: 10, types: ['MethodCall'] }]);
  assert.equal(getCorrect(qlcs), ['method', 'method', 'method']);
});

methodCall.run();

// ---

const variableTrace = suite('VariableTrace');

variableTrace('should record relevant variable histories', () => {
  const qlcs = mod.generate(
    FOR_CODE,
    [{ count: 10, types: ['VariableTrace'] }],
    {
      functionName: 'power',
      arguments: [[2, 2]],
    },
  );
  assert.equal(getCorrect(qlcs), ['0, 1, 2', '1, 2, 4']);
});

variableTrace('should record without function request', () => {
  const qlcs = mod.generate(WHILE_CODE, [
    { count: 1, types: ['VariableTrace'] },
  ]);
  assert.equal(getCorrect(qlcs), ['5, 4, 3, 2, 1, 0, -1']);
});

variableTrace('should generate distractors', () => {
  const qlc = mod.generate(FOR_CODE, [{ count: 1, types: ['VariableTrace'] }], {
    functionName: 'power',
    arguments: [[2, 2]],
  })[0];
  const { correct, distractors } = splitCorrectAndDistractors(qlc);
  assert.equal(correct.length, 1);
  assert.ok(distractors.length > 0);
  const c = `${correct[0]}`;
  assert.ok(['0, 1, 2', '1, 2, 4'].includes(c));
  assert.ok(distractors.filter(s => `${s}`.includes(c)).length > 0);
});

variableTrace.run();

// ---

const executor = suite('Executor');

executor('should transform variable statements', () => {
  const { tree, scope } = mod.createProgramModel(BLA_CODE);
  const { script, variables } = mod.transformToRecorded(tree, scope);
  assert.equal(variables.map(({ name }) => name).sort(), [
    'blabla',
    'i',
    'repeated',
  ]);
  assert.ok(script.includes('__record(0, "i",'));
});

executor('should evaluate and record variable history', () => {
  const input: mod.ProgramInput = {
    functionName: 'power',
    arguments: [[2, 3]],
  };
  const { tree, scope } = mod.createProgramModel(FOR_CODE, input);
  const { script } = mod.transformToRecorded(tree, scope);
  const record = mod.evaluateRecorded(
    script,
    input.functionName,
    input.arguments[0],
  );
  assert.equal(record['0_n'], [1, 2, 4, 8]);
  assert.equal(record['1_i'], [0, 1, 2, 3]);
});

executor('should evaluate without function request', () => {
  const { tree, scope } = mod.createProgramModel(WHILE_CODE);
  const { script } = mod.transformToRecorded(tree, scope);
  const record = mod.evaluateRecorded(script);
  assert.equal(record['0_n'], [5, 4, 3, 2, 1, 0, -1]);
});

executor('should not record function variables', () => {
  const { tree, scope } = mod.createProgramModel(TINY_FUNCTIONS);
  const { script, variables } = mod.transformToRecorded(tree, scope);
  assert.equal(variables.map(({ name }) => name).sort(), ['a', 'newValue']);
  assert.ok(script.includes('__record('));
});

executor.run();
