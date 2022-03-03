import { QLCTemplate } from '../types';
import { functionName, parameterName, parameterValue } from './functions';
import { loopEnd, variableDeclaration } from './lines';
import { methodCall } from './naming';

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
  {
    type: 'MethodCall',
    prepare: methodCall,
  },
];

export default questions;
