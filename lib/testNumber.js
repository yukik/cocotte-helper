/**
 * 数値型の個別テスト
 * @method testNumber
 * @param  {String}   prefix
 * @param  {String}   name
 * @param  {Object}   prop
 * @param  {Number}   value
 */
function testNumber(prefix, name, prop, value) {
  
  if (Number.isNaN(value)) {
    throw new Error(prefix + name + ' : 数値ではありません');
  }

  if ('min' in prop && value < prop.min) {
    throw new Error(prefix + name + ' : ' + prop.min + '以上ではありません');
  }

  if ('min' in prop && prop.max < value) {
    throw new Error(prefix + name + ' : ' + prop.max + '以下ではありません');
  }

  if ('decimal' in prop) {
    var keta = (value.toString().split('.')[1] || '').length;
    if (prop.decimal < keta) {
      throw new Error(prefix + name + ' : 小数点以下は' + prop.decimal + '桁までです');
    }
  }
}

module.exports = exports = testNumber;