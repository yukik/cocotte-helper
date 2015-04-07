
/**
 * dependence
 */
var EOL = require('os').EOL;

/**
 * 指定プロパティの詳細表示
 * @method showProperty
 * @param  {Object}     prop
 */
function showProperty(info) {
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
  }
  if (info.description.length) {
    console.log('        説明 : ' + info.description.join(EOL + '               '));
  }
  console.log();
}

//共通
function showCommon (info) {
  console.log('■' + info.name + 'プロパティ');
  console.log('      タイプ : ' + info.type.name + (info.array ? ' ※配列タイプ' : ''));
  console.log('        必須 : ' + (info.required ? '◯' : '×'));
}

// 文字列
function showString (info) {
  // min,max
  showRange ('      文字長', info);
  // regex
  if (info.regex) {
    console.log('    正規表現 : ' + info.regex.toString());
  }
}

// 数値
function showNumber (info) {
  // min, max
  showRange ('        範囲', info);
  // decimal
  if (info.decimal) {
    console.log('  数値タイプ : 小数点以下あり');
    console.log('少数点以下桁 : ' + info.decimal + '桁');
  } else {
    console.log('  数値タイプ : 整数');
  }
}

// 日時
function showDate (info) {
  // min, max
  showRange('        範囲', info);
}


// 範囲
function showRange (label, info) {
  var range = ('min' in info ? info.min : '') + '〜' + ('max' in info ? info.max : '');
  if (1 < range.length) {
    console.log(label + ' : ' + range);
  }
}

module.exports = exports = showProperty;