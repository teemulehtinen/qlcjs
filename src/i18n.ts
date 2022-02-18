type Text = string | ((n: number) => string);

const texts: { [locale: string]: { [key: string]: Text } } = {
  en: {
    q_function_name: 'Which is the name of the function?',
    q_function_name_line: (n: number) =>
      `Which is the name of the function that is declared on line ${n}?`,
  },
};

// Implement if necessary at some point...
const locale = 'en';

const t = (key: string, n?: number): string => {
  const txt = texts[locale][key];
  if (typeof txt === 'function') {
    return txt(n || 0);
  }
  return txt;
};

export default t;
