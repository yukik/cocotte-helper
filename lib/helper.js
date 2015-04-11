/* jshint forin:false */

/*
 * cocotte-helper
 * Copyright(c) 2013 Yuki Kurata <yuki.kurata@gmail.com>
 * MIT Licensed
 */

'use strict';

/** 
 * dependencies
 */
var HELP_TEXT = require('./help_text');
var ClassHelper = require('./classHelper');
var testConfig = require('./testConfig');

/**
 * ヘルパーを作成する
 * 
 * @method helper
 * @param  {Object}        properties
 * @param  {String|Array}  template    省略可能
 * @return {ClassHelper}   helper
 */
function helper (properties, template) {
  return new ClassHelper(properties, template);
}

/**
 * ヘルプの使用方法を表示します
 * @method help
 */
helper.help = function help() {
  console.log(HELP_TEXT);
};


/**
 * クラスからヘルパーを作成する
 * @method of
 * @param  {Function}    klass
 * @return {ClassHelper} helper
 */
helper.of = function of (klass) {
  if (typeof klass !== 'function') {
    throw new Error('ヘルパーを作成できません。クラスを指定してください');
  }
  var properties = klass.properties;
  if (!properties) {
    throw new Error('ヘルパーを作成できません。プロパティの設定が存在しません');
  }
  return new ClassHelper(properties, klass.template);
};

/**
 * クラスにヘルプ情報が設定されているかどうかを確認する
 * @method isSupport
 * @return {Boolean} 
 */
helper.isSupport = function isSupport (klass) {
  return typeof klass === 'function' &&
    klass.properties &&
    typeof klass.properties === 'object';
};


/**
 * 自動コピー
 *
 * 初期化引数をプロパティに複製します
 * 事前に初期化引数はテストされ、違反した場合は
 * ネストして初期化を行うことができます
 * 
 * プロパティ情報を省略した場合は、コピー先に設定されているプロパティ情報を
 * 自動的に取得します
 * 
 * 未設定のプロパティは名を配列で返します
 * キーが存在していても、値がnull/undefinedの場合も未設定となります
 * 
 * @method copy
 * @param  {Object} config     初期化引数
 * @param  {Object} instance   コピー先
 * @param  {Object} properties プロパティ情報      (省略可能)
 * @return {Array}  unsetNames 未設定プロパティ名
 */
helper.copy = function copy (config, instance, properties) {
  if (config === undefined) {
    config = {};
  }
  if (instance === global) {
    throw new Error('copyは初期化時にのみ使用できます');
  }
  if (typeof instance !== 'object') {
    throw new Error('コピー先が存在しません');
  }
  // 既にコピー済みの場合は処理しない
  if (instance._copiedProperties) {
    return [];
  }
  var props = properties || instance.constructor.properties;
  if (!props) {
    throw new Error('クラスにプロパティ情報が存在しません');
  }
  var unsetNames = [];
  var copied = testConfig(null, props, config, 'copy');

  for(var name in props) { // prototype ok
    if (name in copied) {
      instance[name] = copied[name];
    } else {
      instance[name] = 'type' in props[name] ? null : [];
      unsetNames.push(name);
    }
  }
  // 重複コピー防止フラグを追加
  Object.defineProperty(instance, '_copiedProperties', {
    value: true,
    enumerable: false,
    writable: true,
    configurable: true
  });
  return unsetNames;
};

/**
 * 継承を設定します
 *
 * スーパークラスのプロパティ情報も継承するように設定されるため
 * あらかじめ継承先のプロパティ情報を設定してからメソッドを使用してください
 *
 * @method inherits
 * @param  {Function} ctor
 * @param  {Function} superCtor
 */
helper.inherits = function inherits (ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  var original = ctor.properties;
  if (!original) {
    throw new Error('プロパティ情報が設定されていません');
  }
  if (superCtor.properties) {
    var props = Object.create(superCtor.properties);
    Object.keys(original).forEach(function(k){
      props[k] = original[k];
    });
    ctor.properties = props;
  }
};

module.exports = exports = helper;

