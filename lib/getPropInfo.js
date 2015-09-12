/**
 * dependencies
 */
var EOL = '\n';

// スキップ
var SKIP_COPY = ['name', 'type', 'arrayType', 'description', 'array'];

// 値タイプ
var VALUE_TYPE_TEXT = {
  type     : '単値',
  arrayType: '配列',
  keyType  : 'キーバリュー'
};

module.exports = getPropInfo;

/**
 * プロパティ情報からヘルプの表示に使用しやすいオブジェクトを作成し返す
 * name, valueType, valueTypeTextのプロパティを新たに設定
 * typeにtype/arrayType/keyTypeの値を設定
 * 
 * @method getPropInfo
 * @param  {Object}    prop
 * @return {Object}    info
 */
function getPropInfo (name, prop) {
  if (!prop) {
    return null;
  }

  var hasProps = 'properties' in prop;

  var valueType = 'type' in prop ? 'type' :
                  'arrayType' in prop ? 'arrayType' :
                  'keyType' in prop ? 'keyType' :
                  hasProps ? 'type' :
                  null;

  var type = hasProps ? Object : prop[valueType];

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
    hasProps: hasProps,
    valueType: valueType,
    valueTypeText: VALUE_TYPE_TEXT[valueType],
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
