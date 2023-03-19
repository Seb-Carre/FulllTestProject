import {wordingEn} from './wordingEn';

/**
 * Function to get the text you need, can be used later to make an i18n module !
 * Can be used in the React Tree and tests !
 * @param {string} keyItem
 * the key of the text you're looking for !
 */
export default function text(keyItem: string) {
  // We are going to take the key item
  const resultText = wordingEn[keyItem];
  // If the keyItem exists in the wording file, we are going to return the text
  if (resultText) {
    return resultText;
  } else {
    // If not, we are returing the error message
    return wordingEn.errorKeyItem;
  }
}
