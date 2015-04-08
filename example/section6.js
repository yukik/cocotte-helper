/**
 * 継承クラスの連鎖
 */


var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);
}
Klass1.properties = {
  obj: {
    type: Klass2,
    required: true
  }
};

// クラス2
function Klass2 () {}
Klass2.prototype.info = function () {
  console.log('name:' + this.name);
  console.log('type:' + this.constructor.name);
};
Klass2.properties = {};

// クラス3
function Klass3 (config) {
  helper.copy(config, this);
}
//  - 継承を設定
Klass3.prototype = Object.create(Klass2.prototype, {
  constructor: {value: Klass3, enumerable: false, writable: true, configurable: true}
});
Klass3.properties = {
  name: {
    type: String,
    required: true
  }
};

// 初期化引数
var config = {
  obj: {
    name: 'bar',
    extendType: Klass3
  }
};

// 継承クラスのテスト
helper.of(Klass1).test(config);

// 継承クラスを使用した初期化
var instance = new Klass1(config);
instance.obj.info();

