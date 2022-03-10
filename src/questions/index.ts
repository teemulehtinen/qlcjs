import { QLCTemplate } from '../types';
import { variableTrace } from './dynamic';
import { functionName, parameterName, parameterValue } from './functions';
import { loopEnd, variableDeclaration } from './lines';
import { methodCall } from './naming';

const questions: QLCTemplate[] = [
  {
    type: 'FunctionName',
    prepare: functionName,
    wantsFunctions: true,
  },
  {
    type: 'ParameterName',
    prepare: parameterName,
    wantsFunctions: true,
  },
  {
    type: 'ParameterValue',
    prepare: parameterValue,
    wantsFunctions: true,
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
  {
    type: 'VariableTrace',
    prepare: variableTrace,
    wantsRecordedEvaluation: true,
  },
];

export default questions;
