'use strict';

/** 
 * dependencies
 */
var matrix = require('cocotte-matrix');
var EOL = require('os').EOL;
var showProperty = require('./showProperty');
var testConfig = require('./testConfig');

/**
 * クラスヘルパー
 *
 * インスタンスには２つのプロパティが追加される
 *   props: プロパティ設定
 *   tpl  : テンプレート
 * 
 * @method ClassHelper
 * @param  {Object}       properties プロパティ
 * @param  {String|Array} template   テンプレート (任意)
 *                                        配列の場合は要素ごとに改行されます
 */
function ClassHelper (properties, template) {
  // props
  if (!properties) {
    throw new Error('ヘルパーを作成できません。プロパティの設定が存在しません');
  }
  this.props = properties;
  // template
  this.tpl = null;
  if (typeof template === 'string') {
    this.tpl = template.split(EOL);
  } else if (Array.isArray(template)) {
    this.tpl = template;
  }
}

/**
 * 設定のオブジェクトのテンプレートを表示します
 * @property {Array}
 */
ClassHelper.prototype.template = function template () {
  var tpl = this.tpl;
  console.log('■テンプレート');
  console.log('');
  if (tpl) {
    console.log(tpl.join(EOL));
  } else {
    console.log('(エラー)テンプレートは設定されていません');
  }
  console.log();
};

/**
 * プロパティ情報を表示します
 * 
 * プロパティ名を指定しない場合は、一覧表示します
 * プロパティ名を指定した場合はそのプロパティの詳細を表示します
 * @method property
 * @param  {String} name 省略可能
 */
ClassHelper.prototype.property = function property (name) {
  var props = this.props;
  if (!props) {
    console.log('（エラー）プロパティのヘルプ情報が存在しません');

  } else if (name) {
    var prop = props[name];
    if (prop) {
      showProperty(getPropInfo(name, prop));
    } else {
      console.log('（エラー）プロパティ' + name + 'のヘルプ情報が存在しません');
    }

  } else {
    showProperties(props);
  }
};

/**
 * プロパティ一覧を表示します
 * @method showProperties
 * @param  {Object} props
 */
function showProperties (props) {
  console.log('■プロパティ一覧');
  var infos = [HEADER, '-'];
  Object.keys(props).forEach(function(name){
    infos.push(getMatrixItem(getPropInfo(name, props[name])));
  });
  matrix(infos);
  console.log();
}

// プロパティ一覧のヘッダ
var HEADER = ['プロパティ名', 'タイプ', '配列', '必須', '説明'];

/**
 * リスト
 * @method getMatrixItem
 * @param  {Object}      info
 * @return {Array}
 */
function getMatrixItem (info) {
  return [
    info.name,
    info.type.name,
    info.array ? '◯' : '',
    info.required ? '◯' : '',
    info.description[0] || ''
  ];
}

// スキップ
var SKIP_COPY = ['name', 'type', 'arrayType', 'description', 'array'];

/**
 * プロパティ情報からヘルプの表示に使用しやすいオブジェクトを作成し返す
 * name, arrayのプロパティを新たに設定
 * @method getPropInfo
 * @param  {Object}    prop
 * @return {Object}    info
 */
function getPropInfo (name, prop) {
  if (!prop) {
    return null;
  }

  var type = prop.type || prop.arrayType;
  if (!type) {
    return null;
  }

  var description = prop.description;
  if (typeof description === 'string') {
    description = description.split(EOL);
  }

  var info = {
    name: name,
    type: type,
    array: prop.arrayType === type,
    description: description || []
  };

  Object.keys(prop).reduce(function(x, key){
    if (!~SKIP_COPY.indexOf(key)) {
      x[key] = prop[key];
    }
    return x;
  }, info);

  return info;
}

/**
 * 指定したプロパティの型に設定されているクラスから、さらにヘルパー取得します
 * @method of
 * @param  {String}      name
 * @return {ClassHelper} helper
 */
ClassHelper.prototype.of = function of (name) {
  var prop = this.props[name];
  if (!prop) {
    throw new Error('');
  }
  var klass = prop.type || prop.arrayType;
  return new ClassHelper(klass.properties, klass.template);
};

/**
 * テストします
 * @method test
 * @param  {Arguments|Object} config  初期化引数
 * @param  {String}           action  違反時の動作
 *                               show : コンソール表示   (規定値)
 *                               hide : コンソール非表示、何も動作しない
 *                               throw: 例外発行
 * @return {Boolean}          pass    テストの成否
 */
ClassHelper.prototype.test = function test (config, action) {
  action = !action || !~['show', 'hide', 'throw'].indexOf(action) ? 'show' : action;
  if (action === 'show') {
    console.log('■テスト');
  }
  var pass = testConfig(null, this.props, config, action);
  if (action === 'show') {
    if (pass) {
      console.log('テストが成功しました');
    } else {
      console.log('テストが失敗しました');
    }
    console.log();
  }
  return pass;
};

/*
 * テストのネスト
 * 上記と動作がほぼ同じだが、直接使用することはありません
 * testConfigから、テストのネストが発生した場合にのみ実行されます
 * actionにcopyを受け付けます
 * @param  {String}        prefix  上の階層のプロパティ名
 * @param  {Object}        config  初期化引数
 * @param  {String}        action  テストの動作方法
 *                            show : コンソール表示 (規定値)
 *                            hide : コンソール非表示、何も動作しない
 *                            throw: 例外を発生させる
 *                            copy :     〃
 * @return {Boolean|Object} result
 *                            show : テストの成否
 *                            hide :     〃
 *                            throw:     〃  (必ずtrueになります)
 *                            copy : configの複製を返す
 */
ClassHelper.prototype.testNest = function testNest (prefix, config, action) {
  return testConfig(prefix, this.props, config, action);
};

module.exports = exports = ClassHelper;



