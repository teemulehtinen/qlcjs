import { QLCTemplate } from '../types';
import { functionName, parameterName, parameterValue } from './functions';
import { loopEnd } from './blocks';
import { variableDeclaration } from './variables';

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: functionName,
  },
  {
    type: 'ParameterName',
    prepare: parameterName,
  },
  {
    type: 'ParameterValue',
    prepare: parameterValue,
  },
  {
    type: 'LoopEnd',
    prepare: loopEnd,
  },
  {
    type: 'VariableDeclaration',
    prepare: variableDeclaration,
  },
];

export default questions;
