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
  var props = properties || instance.constructor.properties;
  if (!props) {
    throw new Error('クラスにプロパティ情報が存在しません');
  }
  var unsetNames = [];
  var copied = testConfig(null, props, config, 'copy');
  Object.keys(props).forEach(function (name) {
    if (name in copied) {
      instance[name] = copied[name];
    } else {
      instance[name] = 'type' in props[name] ? null : [];
      unsetNames.push(name);
    }
  });
  return unsetNames;
};


module.exports = exports = helper;



