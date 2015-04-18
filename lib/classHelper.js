'use strict';

/** 
 * dependencies
 */
var EOL = require('os').EOL;
var showProperty = require('./showProperty');
var showProperties = require('./showProperties');
var testConfig = require('./testConfig');
var error = require('./error');

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
function ClassHelper (name, properties, template) {
  // props
  if (!properties) {
    throw new Error('ヘルパーを作成できません。プロパティの設定が存在しません');
  }
  this.name = name || '';
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
  if (name) {
    showProperty(this.name, name, this.props);
  } else {
    showProperties(this.name, this.props);
  }
};
ClassHelper.prototype.properties = ClassHelper.prototype.property;

/**
 * 指定したプロパティの型に設定されているクラスから、さらにヘルパー取得します
 * @method of
 * @param  {String}      name
 * @return {ClassHelper} helper
 */
ClassHelper.prototype.of = function of (name) {
  var prop = this.props[name];
  var klass = prop ? (prop.type || prop.arrayType || prop.keyType) : null;
  if (klass) {
    return new ClassHelper(klass.name, klass.properties, klass.template);
  } else {
    throw new Error('クラスが取得できません');
  }
};

/**
 * テストします
 * @method test
 * @param  {Object}  config  初期化引数
 * @param  {String}  action  違反時の動作
 *                      show : コンソール表示   (規定値)
 *                      hide : コンソール非表示、何も動作しない
 *                      throw: 例外発行
 * @return {Boolean} pass    テストの成否
 */
ClassHelper.prototype.test = function test (config, action) {
  config = config || {};
  var err = error(action || 'show');
  err.start();
  testConfig(null, this.props, config, err.callback);
  return err.end();
};

module.exports = exports = ClassHelper;



