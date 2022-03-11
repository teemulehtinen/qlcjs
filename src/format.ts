import { QLC, QLCOption } from './types';

const questionToText = (qlc: QLC, showTypes?: boolean) =>
  showTypes ? `${qlc.question} [${qlc.type}]` : `${qlc.question}`;

const optionToText = (
  opt: QLCOption,
  showInfo?: boolean,
  showTypes?: boolean,
) =>
  [`* ${opt.answer}`]
    .concat(showTypes ? `[${opt.type}]` : [])
    .concat(showInfo ? `_<small>${opt.info}</small>_` : [])
    .join(' ');

export const qlcToText = (qlc: QLC, showInfo?: boolean, showTypes?: boolean) =>
  [questionToText(qlc, showTypes)]
    .concat(qlc.options.map(o => optionToText(o, showInfo, showTypes)))
    .join('\n');

export const qlcsToText = (
  qlcs: QLC[],
  showInfo?: boolean,
  showTypes?: boolean,
) => qlcs.map(qlc => qlcToText(qlc, showInfo, showTypes)).join('\n\n');
