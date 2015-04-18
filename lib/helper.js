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
var ClassHelper = require('./classHelper');
var testConfig = require('./testConfig');
var error = require('./error');

/**
 * ヘルパーを作成する
 * 
 * @method helper
 * @param  {String}        klassName
 * @param  {Object}        properties
 * @param  {String|Array}  template    省略可能
 * @return {ClassHelper}   helper
 */
function helper (klassName, properties, template) {
  return new ClassHelper(klassName, properties, template);
}

/**
 * クラスからヘルパーを作成する
 * @method of
 * @param  {Function}    klass
 * @return {ClassHelper} helper
 */
helper.of = function of (klass) {
  return new ClassHelper(klass.name, klass.properties, klass.template);
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
 * @return {Object} copied     コピー元オブジェクト
 */
helper.copy = function copy (config, instance, properties) {
  config = config || {};
  if (typeof instance !== 'object') {
    throw new Error('コピー先が存在しません');
  }
  // 既に継承先クラスでコピー済みの場合は処理しない
  if (instance.copied_) {
    return instance.copied_;
  }
  properties = properties || instance.constructor.properties;
  if (!properties) {
    throw new Error('クラスにプロパティ情報が存在しません');
  }

  // テスト
  var err = error('copy');
  err.start();
  var copied = testConfig(null, properties, config, err.callback);
  err.end();

  // コピー
  for(var name in properties) { // prototype ok
    if (properties[name].copy !== false) {
      instance[name] = copied[name];
    }
  }

  // 重複コピー防止 (継承元クラス)
  var superKlass = instance.constructor.super_;
  if (superKlass && superKlass.properties) {
    Object.defineProperty(instance, 'copied_', {
      value: copied,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
  return copied;
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

