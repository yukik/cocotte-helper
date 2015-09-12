/* jshint forin:false */

/**
 * dependencies
 */
var matrix = require('cocotte-matrix');
var getPropInfo = require('./getPropInfo');

module.exports = showProperties;

/**
 * プロパティ一覧を表示します
 * @method showProperties
 * @param  {Object} props
 */
function showProperties (klassName, props) {
  console.log('■' + klassName + 'プロパティ一覧');
  if (props) {
    var infos = [HEADER, '-'];
    addInfo(infos, 0, props);
    matrix(infos);
  } else {
    console.log('（エラー）プロパティのヘルプ情報が存在しません');
  }
  console.log();
}


function addInfo(infos, indent, props) {
  for(var name in props) { // prototype ok
    var prop = props[name];

    var line = getMatrixItem(indent, getPropInfo(name, prop));
    if (line) {
      infos.push(line);
    } else {
      infos.push([addPrefix(indent, '(プロパティ設定エラー)' + name)]);
    }
    // サブプロパティ
    if (prop.properties) {
      var subProps = prop.properties;
      addInfo(infos, indent + 1, subProps);
    }
  }
}

// プロパティ一覧のヘッダ
var HEADER = ['プロパティ名', 'タイプ', '値', '必須', '説明'];

/**
 * リスト
 * @method getMatrixItem
 * @param  {Number}      indent
 * @param  {Object}      info
 * @return {Array}
 */
function getMatrixItem (indent, info) {

  if (!info) {
    return null;
  }
  return [
    addPrefix(indent, info.name),
    info.hasProps ? 'Sub-Object' : info.type.name,
    info.valueTypeText,
    info.required ? '必須' : '',
    info.description[0] || ''
  ];
}


function addPrefix (indent, name) {
  return indent ? new Array(indent+1).join('  ') + name : name;
}
