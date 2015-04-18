/**
 * 数値型の個別テスト
 * @method testNumber
 * @param  {Object}   prop
 * @param  {Number}   value
 * @return {String}   errorMessage
 */
function testNumber(prop, value) {
  
  if (Number.isNaN(value)) {
    return '数値ではありません';
  }

  if ('min' in prop && value < prop.min) {
    return prop.min + '以上ではありません';
  }

  if ('min' in prop && prop.max < value) {
    return prop.max + '以下ではありません';
  }

  if ('decimal' in prop) {
    var keta = (value.toString().split('.')[1] || '').length;
    if (prop.decimal < keta) {
      return '小数点以下は' + prop.decimal + '桁までです';
    }
  }
}

module.exports = exports = testNumber;