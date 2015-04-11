/*
 * プロパティのテストと設定の自動化
 */


var helper = require('cocotte-helper');

// クラス
function Klass (config) {
  helper.copy(config, this);
}

// プロパティ情報
Klass.properties = {
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  }
};

var instance = new Klass({name: 'foo', age: 10});
console.log(instance);
