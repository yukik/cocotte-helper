cocotte-helper
==========

# はじめに

このモジュールでは、クラスのインスタンス化時の処理を省力化することができます  
引数のテストとプロパティへの設定を自動化します  

またコーディング時に記述が正しいかをコンソールで確認することもできます  

# ヘルパー

ヘルパーの基本的な使用法はコンストラクタで、copyコマンドを使用し
プロパティのテストと設定を自動的に行うことです。

```
var helper = require('cocotte-helper');

function Foo (config) {
  helper.copy(config, this);
}

Foo.properties = {
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  }
};

var foo = new Foo({name: 'foo', age: 10});

console.log(foo);
```

## ヘルパーのコマンド

##helper.help()

ヘルパーの使用方法を表示

##helper.copy(config, instance, properties)

テストと同時にプロパティのコピーします  
propertiesを省略した場合はinstanceのクラスに定義されたプロパティ情報から
自動的に設定します

テストに違反した場合は、例外を投げます  
初期化引数で省略されたものは、typeではnull、arrayTypeでは空配列が設定されます

## var classHelper = helper.of(Klass)

クラスヘルパーを作成します  
対象のクラスにプロパティ情報が設定されていなければなりません  
クラスヘルパーは、プロパティ情報やテンプレート表示したりすることができます  
詳しくはクラスペルパーのコマンドを参照してください  


## var classHelper = helper(properties, template)

カスタムヘルパーを作成します  
プロパティ情報の設定されていないクラスでも、プロパティ情報・テンプレートを個別に
指定することで、クラスヘルパーを作成することができます

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
function Klass (config) {
}
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
```

### 設定名
  + type, arrayType
    + 設定値のクラスを指定します
    + typeは単体で指定されることを示します
    + arrayTypeは設定値を配列で指定する必要があることを示します
        + 配列の要素はそれぞれ指定したクラスである必要があります
        + 先のコードのphonesの
    + この設定は排他で必ずどちらか設定する必要があります
  + description
    + 設定の目的を説明します
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
function Klass (config) {
}
Klass.properties = {}; // 省略

Klass.template = [
  'var config = {',
  '  name: "foo",',
  '  age: 30',
  '}'
];

var helper = require('cocotte-helper');
helper.of(Klass).template();
```

# テスト・設定の連鎖

has-aの関係にあるオブジェクトのテストや自動コピーが連鎖させることができます  
具体的には次のコードを確認してください

```
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
    required: false
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


```

Klass1の初期化引数のobjの設定は、Klass2の初期化引数になっています  
この場合は、Klass1のテストや初期化を行う際にKlass2のテストや初期化も連動して行われます  