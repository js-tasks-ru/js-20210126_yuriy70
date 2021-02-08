/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pieces = path.split('.');

  const getProp = (obj, parts) => {
    const result = obj[parts.shift()];
    return (parts.length && result !== undefined) ? getProp(result, parts) : result;
  };

  return obj => getProp(obj, [...pieces]);
}
