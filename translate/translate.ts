import {wordingEn} from './wordingEn';

export default function text(keyItem: string) {
  const resultText = wordingEn[keyItem];
  if (resultText) {
    return resultText;
  } else {
    return wordingEn.errorKeyItem;
  }
}
