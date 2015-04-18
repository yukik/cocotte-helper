/*
 * 専用ヘルパー
 */


var helper = require('cocotte-helper');

// クラス
function Klass(config) {
  helper.copy(config, this);
}

// プロパティ情報
Klass.properties = {
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
  },
  entryDate: {
    type: Date
  }
};

// 専用ヘルパー
var klassHelper = helper.of(Klass);

// 初期化引数
var config = {
  name: 'foo',
  age: 30,
  enrtyDate: '2000-4-20'
};

// テスト
klassHelper.test(config);