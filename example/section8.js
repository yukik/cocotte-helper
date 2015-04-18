/**
 * テスト・初期化の連鎖
 */


var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);
}
Klass1.prototype.info = function () {
  console.log('name:' + this.name);                // foo
  console.log('obj:' + this.obj.constructor.name); // Klass2
};
Klass1.properties = {
  name: {
    type:String,
    required: true
  },
  obj: {
    type: Klass2,   // 自作クラスをtypeに設定できる
    required: true
  }
};

// クラス2
function Klass2 (config) {
  helper.copy(config, this);
}
Klass2.prototype.info = function () {
  console.log('name:' + this.name);   // bar
};
Klass2.properties = {
  name: {
    type: String,
    required: true
  }
};

// 初期化引数
var config = {
  name: 'foo',
  obj: {          // Klass2のconfigをそのまま設定しても良い
    name: 'bar'
  }
};

var klass1Helper = helper.of(Klass1);

// テストの連鎖
klass1Helper.test(config);

// 初期化の連鎖
var instance = new Klass1(config);
instance.info();
instance.obj.info();

// has-aのクラスのヘルパー
var klass2Helper = klass1Helper.of('obj');
klass2Helper.properties();




