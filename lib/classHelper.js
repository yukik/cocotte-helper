'use strict';

/** 
 * dependencies
 */
var EOL = require('os').EOL;
var showProperty = require('./showProperty');
var showProperties = require('./showProperties');
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
    showProperty(name, props);
  } else {
    showProperties(props);
  }
};

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

module.exports = exports = ClassHelper;



