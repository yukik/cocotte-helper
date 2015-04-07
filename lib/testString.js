/**
 * 文字列型の個別テスト
 * @method testString
 * @param  {String}   prefix
 * @param  {String}   name
 * @param  {Object}   prop
 * @param  {String}   value
 */
function testString(prefix, name, prop, value) {

  if (prop.min && value.length < prop.min) {
    throw new Error(prefix + name + ' : 最小文字長(' + prop.min + '〜)に違反しています');
  }

  if (prop.max && prop.max < value.length) {
    throw new Error(prefix + name + ' : 最大文字長(〜' + prop.min + ')に違反しています');
  }

  if (prop.regex && !prop.regex.test(value)) {
    throw new Error(prefix + name + ' : 正規表現に違反しています');
  }
}

module.exports = exports = testString;