/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === undefined || size === undefined) return string;

  if (string.length && size > 0) {
    const arr = [];
    let count, prev;
    string.split('').forEach(char => {
      if (char === prev) {
        if (count < size) arr.push(char);
        count++;
      } else {
        arr.push(char);
        count = 1;
      }
      prev = char;
    });
    return arr.join('');
  }

  return '';
}
