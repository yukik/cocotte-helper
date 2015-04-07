/**
 * 日時型の個別テスト
 * @method testDate
 * @param  {String}      prefix
 * @param  {String}      name
 * @param  {Object}      prop
 * @param  {Date|String} value
 */
function testDate(prefix, name, prop, value) {
  if (typeof value === 'string') {
    value = new Date(value);
  }

  var time = value.getTime();

  if (Number.isNaN(time)) {
    throw new Error(prefix + name + ' : 不正な日時です');
  }

  if ('min' in prop) {
    var min = typeof prop.min === 'string' ? new Date(prop.min) : prop.min;
    if (time < min.getTime()) {
      throw new Error(prefix + name + ' : ' + min.toString() + '以上を指定してください');
    }
  }

  if ('max' in prop) {
    var max = typeof prop.max === 'string' ? new Date(prop.max) : prop.max;
    if (max.getTime() < time) {
      throw new Error(prefix + name + ' : ' + max.toString() + '以下を指定してください');
    }
  }

}

module.exports = exports = testDate;