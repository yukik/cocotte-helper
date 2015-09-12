/**
 * 継承クラス
 */


var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this); // 処理されません
  this.created = new Date();
}
Klass1.properties = {
  name: {
    type:String,
    required: true
  }
};
Klass1.prototype.info = function info() {
  console.log('name:' + this.name);             // foo
  console.log('created:' + this.created);       // Tue Apr 21 2015 09:30:22 GMT+0900 (JST) ※例
  console.log('type:' + this.constructor.name); // Klass2
};

// クラス2
function Klass2 (config) {
  helper.copy(config, this, true);
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