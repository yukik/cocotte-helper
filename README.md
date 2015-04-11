cocotte-helper
==========

# はじめに

このモジュールでは、クラスのインスタンス化時の処理を省力化することができます  
引数のテストとプロパティへの設定を自動化します  

またコーディング時に記述が正しいかをコンソールで確認することもできます  

# ヘルパー

ヘルパーの基本的な使用法はコンストラクタでcopyコマンドを使用し、
プロパティのテストと設定を自動的に行うことです。

```
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
```

初期化引数がプロパティ情報に違反する値が設定されていた場合は例外が発生します  

## ヘルパーのコマンド

##helper.help()

ヘルパーの使用方法を表示

##helper.copy(config, instance, properties)

テストと同時にプロパティのコピーします  
propertiesを省略した場合はinstanceのクラスに定義されたプロパティ情報から
自動的に設定します

テストに違反した場合は、例外を投げます  
このメソッドの戻り値は、初期化引数で省略されたプロパティ名を配列で返します  
また、初期化引数で省略されたものは、typeではnull、arrayTypeでは空配列が設定されます 

## var classHelper = helper.of(Klass)

クラスヘルパーを作成します  
対象のクラスにプロパティ情報が設定されていなければなりません  
クラスヘルパーは、プロパティ情報やテンプレート表示したりすることができます  
詳しくはクラスペルパーのコマンドを参照してください  


## var classHelper = helper(properties, template)

カスタムヘルパーを作成します  
プロパティ情報の設定されていないクラスでも、プロパティ情報・テンプレートを個別に
指定することで、クラスヘルパーを作成することができます

## helper.inherits(Klass2, Klass1)

Klass2の継承元をKlass1に設定します  
詳しくは継承クラスの項で説明します

# クラスヘルパー

```
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
```

## クラスヘルパーのコマンド

## klassHelper.template()

初期化設定のオブジェクトの記述方法を示したテンプレートが表示されます  
引数、戻り値ともに存在しません

## klassHelper.property()

設定できるプロパティの一覧を表示します

## klassHelper.property(propertyName)

指定したプロパティの詳細を表示します

## var otherKlassHelper = klassHelper.of(propertyName)

指定したプロパティのクラスからヘルパーを取得します  
クラスにはヘルプ情報が設定されている必要があります

## var pass = klassHelper.test(config, action)

初期化引数をテストします  
違反している場合は違反内容を、成功した場合はその旨をコンソールに表示します  
戻り値に、テストが成功したかどうかの真偽値を返します  
actionに次の文字列を指定することで次のように挙動を変更します
  
  + show: コンソールにテスト結果を表示します (規定値)
  + hide: コンソールにテスト結果を表示しません
  + throw: テストに違反した場合は、例外を発生させます

# ヘルプ情報をクラスに設定する

ヘルパーから利用されるクラスには、次の２つのプロパティを設定します

  + properties : プロパティ
  + template : テンプレート (省略可能)

## properties

プロパティを定義するには次のように行います  
個別の設定名については後述します

```
function Klass () {}
Klass.properties = {
  name: {
    type: String,
    description: ['氏名', '英名はできるだけカタカナで設定してください'],
    required: true,
    max: 30
  },
  birthday: {
    type: Date,
    description: ['誕生日', '文字列で設定できます']
  },
  address: {
    type: String,
    description: '住所'
  },
  phones: {
    arrayType: String,
    description: ['電話番号', '複数の番号に対応するため配列で設定してください'],
    regex: /^\d{2,4}-\d{2,4}-\d{4}$/
  }
};

var helper = require('cocotte-helper').of(Klass);
helper.property();
helper.property('name');
```

### 設定名
  + type, arrayType,keyType
    + 設定値のクラスを指定します
    + typeは単体で指定されることを示します
    + arrayTypeは設定値を配列で指定する必要があることを示します
        + 配列の要素はそれぞれ指定したクラスである必要があります
    + keyTypeは設定値がキーと値の組み合わせで設定する必要があることを示します
        + 値はそれぞれ指定したクラスである必要があります
    + これらの設定は排他で必ずひとつ設定する必要があります
  + description
    + 設定の目的を説明します
    + 文字列もしくは文字列の配列を指定します
    + 配列を指定した場合は、それぞれの要素の間に改行をふくむようになります
    + 省略可能です
  + required
    + この設定は必ず行う必要があるかを真偽値で示します
    + 省略時はtrueです
    + キーが存在しても、値にnull/undefinedを指定した場合もrequiredに違反します
  + test
    + 値をこまかくテストできる関数を指定します
    + 引数は対象のひとつだけです
        + arrayTypeの場合は配列で渡されます
    + 戻り値は設定されません
    + 違反時は例外を発生させます
    + 値が未設定(undefined/null)の場合は、このテストは行われません

type,arrayType,keyTypeの違いを次のコードで確認してください

```
var helper = require('cocotte-helper');

function Klass (config) {
  helper.copy(config, this);
}
Klass.properties = {
  p_single : {
    type: String
  },
  p_array: {
    arrayType: String
  },
  p_key: {
    keyType: String
  }
};

var config = {
  p_single: 'foo',
  p_array: ['foo', 'bar'],
  p_key: {
    name1: 'foo',
    name2: 'bar'
  }
};

var inst = new Klass(config);
console.log(inst);
```

### String固有の設定名

文字列型には、特別な設定変数が存在します  
いずれも省略可能な設定です

  + min,max
    + 文字長の最小値、最大値をしてします
  + regex
    + 正規表現でより厳密な制限をおこなう事ができます

### Number固有の設定名

数値型には、特別な設定変数が存在します  
いずれも省略可能な設定です

  + min,max
    + 最小値、最大値を指定します
  + decimal
    + 浮動小数点の桁数を示します
    + 省略時は整数として扱われます

### Date固有の設定名

日時型には、特別な設定変数が存在します  
いずれも省略可能な設定です

  + min,max
    + 最小値、最大値を指定します

日時のみ、値の型が文字列でも動作します


## template

templateコマンドで表示するテンプレートを設定します

```
var helper = require('cocotte-helper');

function Klass () {}
Klass.properties = {}; // 省略

// テンプレート
Klass.template = [
  'var config = {',
  '  name: "foo",',
  '  age: 30',
  '}'
];

helper.of(Klass).template();
```

# サブプロパティ

サブプロパティの定義を行うことができます  

```
var helper = require('cocotte-helper');

// クラス
function Klass (config) {
  helper.copy(config, this);
}
Klass.properties = {
  obj: {
    type: Object,
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
klassHelper.property();
klassHelper.property('obj.name');
```

サブプロパティのtypeは必ずObjectにします  
さらに、propertiesを定義します  
サブプロパティにさらにサブプロパティを定義することもできます  
これにより、深い階層をもつ設定を定義することができます  
サブプロパティの詳細情報は.で名称を連結することで取得できます  

# 継承クラス

継承を実装するためにはhelper.inheritsを使用します  
このメソッドは、継承元のプロパティ情報と継承先のプロパティ情報をマージしますので、
必ず継承先のプロパティ情報を定義した後に実行してください

```
var helper = require('cocotte-helper');

// クラス1
function Klass1 (config) {
  helper.copy(config, this);     // copyは継承元から呼び出された場合は重複処理されません
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
```

最後の行で、インスタンスにnameプロパティも設定されていることが確認できます  


# テスト・初期化の連鎖

has-aの関係にあるオブジェクトのテストや自動コピーを連鎖させることができます  
具体的には次のコードを確認してください

```
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
    required: false
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

// テストの連鎖
helper.of(Klass1).test(config);

// 初期化の連鎖
var instance = new Klass1(config);
instance.info();
instance.obj.info();
```

Klass1の初期化引数のobjの設定は、Klass2の初期化引数になっています  
この場合は、Klass1のテストや初期化を行う際にKlass2のテストや初期化も連動して行われます  


## 連鎖時、継承クラスに対応する

初期化が連鎖するオブジェクトにtypeを設定すると、テスト・初期化に使用するクラスを
継承クラスにします  

```
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
```

objはKlass2型を設定する必要がありますが、実際にはKlass3型です  
ただし、Klass3はKlass2を継承しているため問題はありません  
継承が正しくない場合は、テストは合格せず、初期化は失敗します


