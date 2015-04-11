/*jshint maxparams:8, forin:false*/

var testString = require('./testString');
var testNumber = require('./testNumber');
var testDate = require('./testDate');

/**
 * 全項目のテスト
 *
 * helper.testから呼び出し時のみ
 *   プロパティの全項目をテストします
 *   違反時にどのような動作を行うかの挙動を選択することができます
 *   戻り値はテストの成否を真偽値で返します
 * 
 * helper.copyから呼び出し時のみ
 *   プロパティの全項目をテストします
 *   同時に複製されたconfigを返します
 *   その際、ネストされたテストでオブジェクトをインスタンス化します
 * 
 * @method testConfig
 * @param  {String}   prefix  上の階層のプロパティ名
 * @param  {Object}   props   プロパティ設定
 * @param  {Object}   config  テスト対象
 * @param  {String}   action  違反時の動作
 *                       show : コンソール表示
 *                       hide : コンソール非表示
 *                       throw: 例外発生
 *                       copy :     〃
 * @return {Boolean|Object}  result
 *                       show : 成否 Boolean
 *                       hide :     〃
 *                       throw:     〃
 *                       copy : configの複製を返す
 */
function testConfig(prefix, props, config, action) {
  prefix = prefix ? prefix + '.' : '';
  config = config || {};
  action = action || 'show';
  var pass = true;
  var copied = {};

  for(var name in props) { // prototype ok
    var prop = props[name];
    var valueType = 'type' in prop ? 'type' : 'arrayType' in prop ? 'arrayType' :
        'keyType' in prop ? 'keyType' : null;
    if (valueType) {
      pass = testProp(prefix, name, valueType, prop, config[name], action, copied) && pass;
    }
  }

  if (action === 'copy') {
    return copied;
  }
  return pass;
}

/**
 * 個別テスト
 * @method testProp
 * @param  {String}  prefix
 * @param  {String}  name
 * @param  {String}  valueType
 * @param  {Object}  prop
 * @param  {Mixed}   value
 * @param  {Boolean} action
 * @return {Boolean} pass
 */
function testProp (prefix, name, valueType, prop, value, action, copied) {
  try {
    // required
    if (value === undefined || value === null) {
      if (prop.required) {
        throw new Error(prefix + name + ' : 必須項目です');
      }
      return true;
    }


    // サブプロパティの検査
    if (prop.properties) {
      testSubProp(prefix, name, valueType, prop, value, action, copied);
      return true;
    }

    var type = prop[valueType];

    testType(prefix, name, type, valueType, prop, value, action, copied);

    // プリミティブ毎のテスト
    var test = type === String ? testString : type === Number ? testNumber :
               type === Date   ? testDate : null;
    if (test) {
      switch(valueType) {
      case 'type':
        test(prefix, name, prop, value);
        break;
      case 'arrayType':
        value.forEach(function(v){test(prefix, name, prop, v);});
        break;
      case 'keyType':
        Object.keys(value).forEach(function(k){test(prefix, name, prop, value[k]);});
        break;
      }
    }

    // カスタムテスト
    if (prop.test) {
      try {
        prop.test(value);
      } catch (e) {
        throw new Error(prefix + name + ' : ' + e.message);
      }
    }
    return true;

  } catch (e) {
    switch(action) {
    case 'show':
      var message = e.message;
      if (message) {
        console.log(message);
      }
      return false;
    case 'hide':
      return false;
    case 'throw':
    case 'copy':
      throw e;
    }
  }
}

/**
 * サブプロパティのテスト
 * @method testSubProp
 * @param  {String}   prefix
 * @param  {Object}   prop
 * @param  {Object}   value
 * @param  {String}   action
 * @param  {Object}   copied
 */
function testSubProp (prefix, name, valueType, prop, value, action, copied) {
  var values;

  switch(valueType) {

  case 'type':
    if (!value || typeof value !== 'object') {
      throw new Error(prefix + name + ' : オブジェクトではありません');
    }
    var result = testConfig(prefix + name, prop.properties, value, action);
    if (action === 'copy') {
      copied[name] = result;
    } else if (result === false) {
      throw new Error();
    }
    break;

  case 'arrayType':
    if (!Array.isArray(value)) {
      throw new Error(prefix + name + ' : 配列ではありません');
    }
    values = [];
    value.forEach(function(v) {
      var result = testConfig(prefix + name, prop.properties, v, action);
      if (action === 'copy') {
        values.push(result);
      } else if (result === false) {
        throw new Error();
      }
    });
    if (action === 'copy') {
      copied[name] = values;
    }
    break;

  case 'keyType':
    if (!value || typeof value !== 'object') {
      throw new Error(prefix + name + ' : オブジェクトではありません');
    }
    values = {};
    Object.keys(value).forEach(function(k) {
      var result = testConfig(prefix + name, prop.properties, value[k], action);
      if (action === 'copy') {
        values.push(result);
      } else if (result === false) {
        throw new Error();
      }
    });
    if (action === 'copy') {
      copied[name] = values;
    }
    break;
  }
}

/**
 * 型のテスト
 *
 *  actionがcopyの場合は、このテストにパスした場合に
 *  このタイミングで複製のオブジェクトの値を設定します
 *
 * @method testType
 * @param  {String}   prefix
 * @param  {String}   name
 * @param  {Function} type
 * @param  {String}   valueType
 * @param  {Object}   prop
 * @param  {Mixed}    value
 * @param  {String}   action
 * @param  {Object}   copied
 */
function testType (prefix, name, type, valueType, prop, value, action, copied) {
  var values;

  // 単体
  switch(valueType) {
  case 'type':
    var newValue = testType2(prefix, name, type, value, action);
    if (action === 'copy') {
      copied[name] = newValue;
    }
    break;

  case 'arrayType':
    if (!Array.isArray(value)) {
      throw new Error(prefix + name + ' : 配列ではありません');
    }
    values = [];
    value.forEach(function(v){
      values.push(testType2(prefix, name, type, v, action, copied));
    });
    if (action === 'copy') {
      copied[name] = values;
    }
    break;

  case 'keyType':
    if (!value || typeof value !== 'object') {
      throw new Error(prefix + name + ' : オブジェクトではありません');
    }
    values = {};
    Object.keys(value).forEach(function(k){
      values[k] = (testType2(prefix, name, type, value[k], action, copied));
    });
    if (action === 'copy') {
      copied[name] = values;
    }
    break;
  }
}

/**
 * 型のテスト２
 * @method testType2
 * @param  {String} prefix
 * @param  {String} name
 * @param  {String} type
 * @param  {Mixed}  value
 * @param  {String} action
 * @return {Mixed}  newValue
 */
function testType2 (prefix, name, type, value, action) {
  if (equalType(type, value)) {
    if (action === 'copy') {
      return value;
    }

  } else if (type === Date && typeof value === 'string') {
    if (action === 'copy') {
      return new Date(value);
    }

  } else if (typeof value === 'object' && value.constructor ===  Object) {
    return testHasA(prefix, name, type, value, action);

  } else {
    throw new Error(prefix + name + ' : ' + type.name + '型ではありません');
  }
}

/**
 * 値のクラス（型）が一致するかどうか
 *
 * 値がオブジェクトかつtypeが設定されている場合は
 * テストがネストするため必ずfalseを返します
 * @method equalType
 * @param  {Function}  type
 * @param  {Mixed}     value
 * @return {Boolean}   equal
 */
function equalType(type, value) {
  if (value === null || value === undefined) {
    return false;
  }
  switch(typeof value) {
  case 'string':
    return type === String;
  case 'number':
    return type === Number;
  case 'boolean':
    return type === Boolean;
  case 'function':
    return type === Function;
  default:
    return !value.type && value instanceof type;
  }
}

/**
 * テストを連鎖します
 * @method testHasA
 * @param  {String}         prefix
 * @param  {String}         name
 * @param  {Function}       type
 * @param  {Mixed}          value
 * @param  {String}         action
 * @return {Boolean|Object} result
 */
function testHasA (prefix, name, type, value, action) {
  switch(type) {
  case String:
  case Number:
  case Boolean:
  case Function:
  case Object:
    return null;
  }
  var Klass = type;
  if (value.type) {
    Klass = value.type;
    if (!(Klass.prototype instanceof type)) {
      throw new Error(prefix + name +'.type : 指定した型は' + type.name + 'を継承していません');
    }
  }
  if (!Klass.properties) {
    throw new Error(prefix + name + ' : ' + type.name + 'クラスはヘルパーをサポートしていません');
  }
  var result = testConfig(prefix + name, Klass.properties, value, action);
  if (action === 'copy') {
    return new Klass(result);
  } else if (result === true) {
    return true;
  } else {
    throw new Error();
  }
}

module.exports = exports = testConfig;