var helper = require('cocotte-helper');

// テンプレート
var template = [
  'var config = {',
  '  name: \'foo\',',
  '  age: 30',
  '};',
  '',
  'var instance = new Klass(config);'
];

// プロパティ
var properties = {
  name: {
    type: String,
    description: '氏名',
    required: true,
    max: 20
  },
  age: {
    type: Number,
    description: '年齢',
    min: 0,
    max: 120
  }
};

// クラス
function Klass(config) {
  helper.copy(config, this);
}
Klass.properties = properties;
Klass.template = template;

// クラスヘルパーを作成します
var klassHelper = helper.of(Klass);

// 次でも同じ機能をもつクラスヘルパーを作成できます
// var klassHelper = helper(properties, template);

// 初期化引数
var config = {
  name: 'foo',
  age: 30
};

// 引数の事前テスト
var pass = klassHelper.test(config);
if (!pass) {
  throw new Error('設定エラー');
}