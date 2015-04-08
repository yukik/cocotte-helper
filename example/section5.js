/**
 * テスト・初期化の連鎖
 */


var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);
}
Klass1.prototype.info = function () {
  console.log('name:' + this.name);
  console.log('obj:' + this.obj.constructor.name);
};
Klass1.properties = {
  name: {
    type:String,
    required: true
  },
  obj: {
    type: Klass2,
    required: true
  }
};

// クラス2
function Klass2 (config) {
  helper.copy(config, this);
}
Klass2.prototype.info = function () {
  console.log('name:' + this.name);
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
  obj: {
    name: 'bar'
  }
};

// テストの連鎖
helper.of(Klass1).test(config);

// 初期化の連鎖
var instance = new Klass1(config);
instance.info();
instance.obj.info();

