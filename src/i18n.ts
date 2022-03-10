/* eslint-disable @typescript-eslint/no-explicit-any */

type TextEntry = string | ((...args: any[]) => string);

const texts: { [locale: string]: { [key: string]: TextEntry } } = {
  en: {
    q_function_name: 'Which is the name of the function?',
    q_function_name_line: (...args) =>
      `Which is the name of the function that is declared on line ${args[0]}?`,
    o_function_correct: 'Correct, this is the name',
    o_function_function:
      'The keyword/command "function" is used when the program is about to declare a function',
    o_function_parameter:
      'This is a parameter name for a value passed as an argument when calling the function',
    o_function_variable:
      'This is a variable name used inside the function body',
    o_function_keyword:
      'This is a program keyword/command used inside the function body',
    o_function_literal:
      'This is a literal value that is used inside the function body',

    q_parameter_name: 'Which are the parameter names of the function?',
    q_parameter_name_line: (...args) =>
      `Which are the parameter names of the function that is declared on line ${args[0]}?`,
    o_parameter_correct: (...args) =>
      args[0] > 1
        ? `Correct, this is one of the ${args[0]} parameter names for this function`
        : 'Correct, this is the only parameter name for this function',
    o_parameter_function_name:
      'This is the name of the function that is used to call the function',

    q_parameter_value: (...args) =>
      `Which value does <em>${args[0]}</em> have when execution of <em>${args[1]}</em> starts?`,
    o_parameter_value_correct:
      'Correct, this is the value passed as an argument for the given parameter',
    o_parameter_value_other:
      'This value is passed as an argument BUT for another parameter than given in the question',
    o_parameter_value_random:
      'This is a random value which is not equal to the value initially passed as an argument for the given parameter',

    q_loop_end: (...args) =>
      `A program loop starts on line ${args[0]}. Which is the last line inside it?`,
    o_loop_end_correct:
      'Correct, this is the last line inside the loop (closing curly bracket may appear later)',
    o_loop_end_before: 'The loop starts after this line',
    o_loop_end_after: 'The loop ends before this line',
    o_loop_end_inside:
      'This line is inside the loop BUT it is not the last one',

    q_variable_write_declaration: (...args) =>
      `A value is assigned to variable <em>${args[0]}</em> on line ${args[1]}. On which line is <em>${args[0]}</em> declared?`,
    q_variable_read_declaration: (...args) =>
      `A value is accessed from variable <em>${args[0]}</em> on line ${args[1]}. On which line is <em>${args[0]}</em> declared?`,
    o_variable_declaration_correct: (...args) =>
      `Correct, this is the line where the variable is declared using the keyword ${args[0]}`,
    o_variable_declaration_reference:
      'This line references (reads or writes) the given variable BUT it is declared before',
    o_variable_declaration_random:
      'This is a random line that does not handle the given variable',

    q_method_call: (...args) =>
      `Which best describes <em>${args[0]}</em> on line ${args[1]}?`,
    o_method_correct:
      'Correct, it calls a method of an object (method is a function declared for the object)',
    o_name_argument:
      'No, arguments are values or expressions given for a function/method call (inside parenthesis)',
    o_name_keyword:
      'No, keyword/command describes a word that is reserved for describing program structure and cannot be used as a name',
    o_name_operator:
      'No, programs have typically arithmetic, comparison, and logical operators e.g. +, ===, or &&',
    o_name_parameter:
      'No, parameters are used to name inputs when functions are declared',

    q_variable_trace: (...args) =>
      `Which is the ordered sequence of values that are assigned to variable <em>${args[0]}</em> while executing <em>${args[1]}</em>?`,
    o_trace_correct:
      'Correct, step by step these values are assigned to the variable',
    o_trace_miss: 'No, this sequence is missing a value that gets assigned',
    o_trace_extra: 'No, this sequence has an extra value that is not assigned',
    o_trace_random: 'No, this is an incorrect random sequence',
  },
};

// Implement if necessary at some point...
const locale = 'en';

const t = (key: string, ...args: any[]): string => {
  const txt = texts[locale][key];
  if (typeof txt === 'function') {
    return txt(...args);
  }
  return txt;
};

export default t;
