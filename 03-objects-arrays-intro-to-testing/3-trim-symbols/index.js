/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) return string;

  let result = '';
  let charCounter = 0;
  let currentChar = string[0];

  for (let char of string) {
    if (char === currentChar) {
      charCounter++;
      addChar(char);
    } else {
      currentChar = char;
      charCounter = 1;
      addChar(char);
    }
  }

  function addChar(char) {
    charCounter <= size ? result += char : result;
  }

  return result;
}
