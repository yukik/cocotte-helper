/*jshint maxparams:8, forin:false*/

var testString = require('./testString');
var testNumber = require('./testNumber');
var testDate = require('./testDate');

module.exports = testConfig;
/**
 * 全項目のテスト
 * 
 * @method testConfig
 * @param  {String}   prefix  上の階層のプロパティ名
 * @param  {Object}   props   プロパティ設定
 * @param  {Object}   config  テスト対象
 * @param  {Function} err     エラー関数
 * @param  {Object}   copied  コピー対象
 * @param  {Object}   copied  
 */
function testConfig(prefix, props, config, err) {
  var copied = {};
  for(var name in props) { // prototype ok
    copied[name] = testProp(prefix, name, props, config, err);
  }
  return copied;
}

/**
 * 個別テスト
 * @method testProp
 * @param  {String}   prefix
 * @param  {String}   name
 * @param  {Object}   props
 * @param  {Object}   config
 * @param  {Function} err
 */
function testProp (prefix, name, props, config, err) {
  var prop = props[name];
  var valueType = 'type'       in prop ? 'type' :
                  'arrayType'  in prop ? 'arrayType' :
                  'keyType'    in prop ? 'keyType' :
                  'properties' in prop ? 'type' :
                  null;

  if (!valueType) {
    err(prefix, name, 'type・arrayType・keyType・propertiesのいずれかが設定されていません');
    return null;
  }

  var value = config[name];

  // required
  if (value === undefined || value === null) {
    if (prop.required) {
      err(prefix, name, '必須項目です');
    }
    return valueType === 'type'      ? null :
           valueType === 'arrayType' ? []   :
           valueType === 'keyType'   ? {}   : null;
  }

  // valueType
  switch(valueType) {
  case 'type':
    break;
  case 'arrayType':
    if (!Array.isArray(value)) {
      err(prefix, name, '配列ではありません');
      return null;
    }
    break;
  case 'keyType':
    if (!value || typeof value !== 'object') {
      err(prefix, name, 'オブジェクトではありません');
      return null;
    }
    break;
  }


  var copied;

  // サブプロパティ
  if (prop.properties) {
    prefix = prefix ? prefix + '.' + name : name;
    props = prop.properties;
    switch(valueType) {
    case 'type':
      copied = testConfig(prefix, props, value, err);
      break;
    case 'arrayType':
      copied = [];
      value.forEach(function(v){
        copied.push(testConfig(prefix, props, v, err));
      });
      break;
    case 'keyType':
      copied = {};
      Object.keys(value).forEach(function(k){
        copied[k] = testConfig(prefix, props, value[k], err);
      });
      break;
    }
    return copied;
  }


  // クラステスト
  var type = prop[valueType];

  switch(valueType) {
  case 'type':
    copied = testType(prefix, name, null, type, value, err);
    break;

  case 'arrayType':
    copied = [];
    value.forEach(function(v, i){
      copied.push(testType(prefix, name, i, type, v, err));
    });
    break;

  case 'keyType':
    copied = {};
    Object.keys(value).forEach(function(k){
      copied[k] = testType(prefix, name, k, type, value[k], err);
    });
    break;
  }

  // プリミティブ毎のテスト
  var test = type === String ? testString : type === Number ? testNumber :
             type === Date   ? testDate   : null;
  if (test) {
    switch(valueType) {
    case 'type':
      var msg = test(prop, value);
      if (msg) {
        err(prefix, name, msg);
      }
      break;
    case 'arrayType':
      value.forEach(function(v, i) {
        var msg = test(prop, v);
        if (msg) {
          err(prefix, name, msg, i);
        }
      });
      break;
    case 'keyType':
      Object.keys(value).forEach(function(k){
        var msg = test(prop, value[k]);
        if (msg) {
          err(prefix, name, msg, k);
        }
      });
      break;
    }
  }

  // カスタムテスト
  if (prop.test) {
    try {
      prop.test(value, config);
    } catch (e) {
      err(prefix, name, e.message);
    }
  }

  return copied;
}

/**
 * 型テスト
 * @method testType
 * @param  {String} type
 * @param  {Mixed}  value
 * @return {Mixed}  newValue  
 */
function testType (prefix, name, key, type, value, err) {
  var msg = type.name + '型ではありません';

  if (value === null || value === undefined || Number.isNaN(value)) {
    err(prefix, [name, key], msg);
    return null;
  }

  // プリミティブ
  switch(type) {
  case String:
  case Number:
  case Boolean:
  case Function:
    if (typeof value !== type.name.toLowerCase()) {
      err(prefix, [name, key], msg);
      return null;
    }
    return value;

  case Date:
    if (typeof value === 'string') {
      value = new Date(value);
      if(Number.isNaN(value.getTime())) {
        err(prefix, [name, key], msg);
        return null;
      }
    } else if (!(value instanceof Date)) {
      err(prefix, [name, key], msg);
      return null;
    }
    return value;

  default:
    break;
  }

  // has-a (object)
  if (value instanceof type) {
    return value;
  }

  // has-a (config)
  var Klass;
  if ('type' in value) {
    Klass = value.type;
    if (typeof value.type !== 'function') {
      msg = 'クラスを指定してください';
      err(prefix, [name, key, 'type'], msg);
      return null;
    }
    if (!(Klass.prototype instanceof type)) {
      msg = Klass.name + 'は、' + type.name + 'を継承していません';
      err(prefix, [name, key, 'type'], msg);
      return null;
    }
  } else {
    Klass = type;
  }

  var props = Klass.properties;
  
  if (!props) {
    msg = Klass.name + 'クラスはヘルパーをサポートしていません';
    err(prefix, [name, key, 'type'], msg);
    return null;
  }

  prefix = prefix ? prefix + '.' + name : name;

  return new Klass(testConfig(prefix, props, value, err));
}

