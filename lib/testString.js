/**
 * 文字列型の個別テスト
 * @method testString
 * @param  {Object}   prop
 * @param  {String}   value
 * @return {String}   errorMessage
 */
function testString(prop, value) {

  if (prop.min && value.length < prop.min) {
    return ' : 最小文字長(' + prop.min + '〜)に違反しています';
  }

  if (prop.max && prop.max < value.length) {
    return '最大文字長(〜' + prop.min + ')に違反しています';
  }

  if (prop.regex && !prop.regex.test(value)) {
    return '正規表現に違反しています';
  }
}

module.exports = exports = testString;