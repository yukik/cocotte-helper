/**
 * サブプロパティ
 */


var helper = require('cocotte-helper');

// クラス
function Klass (config) {
  helper.copy(config, this);
}
Klass.properties = {
  obj: {
    properties: {
      name: {
        type: String,
      }
    }
  }
};

// 初期化引数
var config = {
  obj: {name: 'foo'}
};

var klassHelper = helper.of(Klass);

// テスト
klassHelper.test(config);

// 初期化
var instance = new Klass(config);
console.log(instance.obj.name);

// 定義の取得
klassHelper.properties();
klassHelper.property('obj.name');