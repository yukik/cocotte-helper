/* jshint forin:false */

/**
 * dependence
 */
var EOL = '\n';
var getPropInfo = require('./getPropInfo');

module.exports = showProperty;

/**
 * 指定プロパティの詳細表示
 * サブプロパティは.で連結した文字列を指定します
 * @method showProperty
 * @param {String} name
 * @param {Object} prop
 */
function showProperty(klassName, name, props) {

  if (klassName) {
    console.log('■' + klassName + '.' + name + 'プロパティ');
  } else {
    console.log('■' + name + 'プロパティ');
  }

  var prop = getProp(name, props);

  if (!prop) {
    console.log('(エラー) プロパティが存在しません');
    console.log();
    return;
  }

  var info = getPropInfo(name, prop);
  showCommon(info);
  switch(info.type) {
  case String:
    showString(info);
    break;
  case Number:
    showNumber(info);
    break;
  case Date:
    showDate(info);
    break;
  case Object:
    showObject(info);
    break;
  }
  if (info.description.length) {
    console.log('          説明 : ' + info.description.join(EOL + '                 '));
  }
  console.log();
}

/**
 * プロパティ定義を取得する
 * @method getProp
 * @param  {String} names
 * @param  {Object} props
 * @return {Object} property
 */
function getProp (names, props) {
  var prop = names.split('.').reduce(function(x, name) {
    return x && x.properties ? x.properties[name] : null;
  }, {properties: props});
  if (prop) {
    return prop;
  } else {
    console.log('（エラー）プロパティ' + names + 'のヘルプ情報が存在しません');
  }
}

//共通
function showCommon (info) {
  if (info.hasProps) {
    console.log('        タイプ : Sub-Object');
  } else {
    console.log('        タイプ : ' + info.type.name);
  }
  console.log('            値 : ' + info.valueTypeText);
  console.log('          必須 : ' + (info.required ? '◯' : '×'));
}

// 文字列
function showString (info) {
  // min,max
  showRange ('        文字長', info);
  // regex
  if (info.regex) {
    console.log('      正規表現 : ' + info.regex.toString());
  }
}

// 数値
function showNumber (info) {
  // min, max
  showRange ('          範囲', info);
  // decimal
  if (info.decimal) {
    console.log('    数値タイプ : 小数点以下あり');
    console.log('  少数点以下桁 : ' + info.decimal + '桁');
  } else {
    console.log('    数値タイプ : 整数');
  }
}

// 日時
function showDate (info) {
  // min, max
  showRange('          範囲', info);
}

// オブジェクト(サブプロパティあり)
function showObject (info) {
  var subProps = info.properties;
  if (subProps) {
    var names = [];
    for(var name in subProps) { // prototype ok
      names.push(name);
    }
    var subNames = names.join(',');
    console.log('サブプロパティ : ' + subNames);
  }
}

// 範囲
function showRange (label, info) {
  var range = ('min' in info ? info.min : '') + '〜' + ('max' in info ? info.max : '');
  if (1 < range.length) {
    console.log(label + ' : ' + range);
  }
}

