/**
 * dependencies
 */
var EOL = require('os').EOL;

// スキップ
var SKIP_COPY = ['name', 'type', 'arrayType', 'description', 'array'];

/**
 * プロパティ情報からヘルプの表示に使用しやすいオブジェクトを作成し返す
 * name, arrayのプロパティを新たに設定
 * arrayTypeの値をtypeに設定
 * 
 * @method getPropInfo
 * @param  {Object}    prop
 * @return {Object}    info
 */
function getPropInfo (name, prop) {
  if (!prop) {
    return null;
  }

  var type = prop.type || prop.arrayType;
  if (!type) {
    return null;
  }

  var description = prop.description;
  if (typeof description === 'string') {
    description = description.split(EOL);
  }

  var info = {
    name: name,
    type: type,
    array: prop.arrayType === type,
    description: description || []
  };

  Object.keys(prop).reduce(function(x, key){
    if (!~SKIP_COPY.indexOf(key)) {
      x[key] = prop[key];
    }
    return x;
  }, info);

  return info;
}

module.exports = exports = getPropInfo;