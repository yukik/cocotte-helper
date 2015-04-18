/**
 * 継承クラス
 */


var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);     // copyは継承元から呼び出された場合は重複処理されません
  this.created = new Date();     // 明示的に継承元から呼び出しを行わなければ実行されません
}
Klass1.properties = {
  name: {
    type:String,
    required: true
  }
};
Klass1.prototype.info = function info() {
  console.log('name:' + this.name);             // foo
  console.log('created:' + this.created);       // undefined
  console.log('type:' + this.constructor.name); // Klass2
};

// クラス2
function Klass2 (config) {
  helper.copy(config, this);
  // Klass1.call(this, config);  // 継承元のクラスのコンストラクタの呼び出す場合
}
//  - プロパティ情報はinheritsの前に定義
Klass2.properties = {
  age: {
    type: Number,
    required: true
  }
};
//  -  継承
helper.inherits(Klass2, Klass1);

// プロパティ情報の表示
var hpr = helper.of(Klass2);
hpr.property();
hpr.property('name');

// 初期化
var instance = new Klass2({age: 10, name: 'foo'});
instance.info();
