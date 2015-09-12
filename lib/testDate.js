/**
 * 日時型の個別テスト
 * @method testDate
 * @param  {Object}      prop
 * @param  {Date|String} value
 * @return {String}      errorMessage
 */
module.exports = function testDate(prop, value) {

  var time = value.getTime();

  if (Number.isNaN(time)) {
    return '不正な日時です';
  }

  if ('min' in prop) {
    var min = typeof prop.min === 'string' ? new Date(prop.min) : prop.min;
    if (time < min.getTime()) {
      return min.toString() + '以上を指定してください';
    }
  }

  if ('max' in prop) {
    var max = typeof prop.max === 'string' ? new Date(prop.max) : prop.max;
    if (max.getTime() < time) {
      return max.toString() + '以下を指定してください';
    }
  }

};