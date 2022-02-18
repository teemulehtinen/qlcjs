/* eslint-disable @typescript-eslint/no-explicit-any */

type TextEntry = string | ((...args: any[]) => string);

const texts: { [locale: string]: { [key: string]: TextEntry } } = {
  en: {
    q_function_name: 'Which is the name of the function?',
    q_function_name_line: (...args) =>
      `Which is the name of the function that is declared on line ${args[0]}?`,
    q_parameter_name: 'Which are the parameter names of the function?',
    q_parameter_name_line: (...args) =>
      `Which are the parameter names of the function that is declared on line ${args[0]}?`,
    q_parameter_value: (...args) =>
      `Which value does ${args[0]} have when execution of ${args[1]} starts?`,
    q_loop_end: (...args) =>
      `A program loop starts on line ${args[0]}. Which is the last line inside it?`,
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
