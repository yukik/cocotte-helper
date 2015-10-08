/**
 * 連鎖時、継承クラスに対応する
 */

/*global Cocotte*/
var isClient = typeof window === 'object';
var helper = isClient ? Cocotte.helper : require('..');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);
}
Klass1.properties = {
  obj: {
    type: Klass2,    // 継承元のクラスを指定
    required: true
  }
};

// クラス2
function Klass2 (config) {
  helper.copy(config, this);
}
Klass2.prototype.info = function () {
  console.log('name:' + this.name);
  console.log('type:' + this.constructor.name);  // Klass3
};
Klass2.properties = {
  name: {
    type : String,
    required: true
  }
};

// クラス3
function Klass3 (config) {
  helper.copy(config, this);
}
Klass3.properties = {
  age: {
    type: Number,
    required: true
  }
};
helper.inherits(Klass3, Klass2);

// 初期化引数
var config = {
  obj: {
    type: Klass3,   // 継承先のクラスを指定できる
    name: 'bar',
    age: 10
  }
};

// 継承クラスのテスト
helper.of(Klass1).test(config);

// 継承クラスを使用した初期化
var instance = new Klass1(config);
instance.obj.info();
