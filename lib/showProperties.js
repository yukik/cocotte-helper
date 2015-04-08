/**
 * dependencies
 */
var matrix = require('cocotte-matrix');
var getPropInfo = require('./getPropInfo');

/**
 * プロパティ一覧を表示します
 * @method showProperties
 * @param  {Object} props
 */
function showProperties (props) {
  console.log('■プロパティ一覧');
  var infos = [HEADER, '-'];
  addInfo(infos, 0, props);
  matrix(infos);
  console.log();
}


function addInfo(infos, indent, props) {
  Object.keys(props).forEach(function(name){
    var prop = props[name];
    infos.push(getMatrixItem(indent, getPropInfo(name, prop)));

    // サブプロパティ
    if ((prop.type || prop.arrayType) === Object && prop.properties) {
      var subProps = prop.properties;
      addInfo(infos, indent + 1, subProps);
    }
  });
}

// プロパティ一覧のヘッダ
var HEADER = ['プロパティ名', 'タイプ', '配列', '必須', '説明'];

/**
 * リスト
 * @method getMatrixItem
 * @param  {Number}      indent
 * @param  {Object}      info
 * @return {Array}
 */
function getMatrixItem (indent, info) {
  var prefix = indent ? new Array(indent+1).join('  ') : '';
  return [
    prefix + info.name,
    info.type.name,
    info.array ? '配列' : '',
    info.required ? '必須' : '',
    info.description[0] || ''
  ];
}


module.exports = exports = showProperties;