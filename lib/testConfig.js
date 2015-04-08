/*jshint maxparams:6*/

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

  Object.keys(props).forEach(function (name) {
    pass = testProp(prefix, name, props[name], config[name], action, copied) && pass;
  });

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
 * @param  {Object}  prop
 * @param  {Mixed}   value
 * @param  {Boolean} action
 * @return {Boolean} pass
 */
function testProp (prefix, name, prop, value, action, copied) {
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
      testSubProp(prefix, name, prop, value, action, copied);
      return true;
    }

    testType(prefix, name, prop, value, action, copied);

    // プリミティブ毎のテスト
    var single = 'type' in prop;
    switch(single ? prop.type : prop.arrayType) {
    case String:
      if (single) {
        testString(prefix, name, prop, value);
      } else {
        value.forEach(function(v){testString(prefix, name, prop, v);});
      }
      break;
    case Number:
      if (single) {
        testNumber(prefix, name, prop, value);
      } else {
        value.forEach(function(v){testNumber(prefix, name, prop, v);});
      }
      break;
    case Date:
      if (single) {
        testDate(prefix, name, prop, value);
      } else {
        value.forEach(function(v){testDate(prefix, name, prop, v);});
      }
      break;
    case Object:
      if (prop.properties) {

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
function testSubProp (prefix, name, prop, value, action, copied) {
  var single = 'type' in prop;

  // - 単体
  if (single) {
    if (!value || typeof value !== 'object') {
      throw new Error(prefix + name + ' : オブジェクトではありません');
    }
    var result = testConfig(prefix + name, prop.properties, value, action);
    if (action === 'copy') {
      copied[name] = result;
    } else if (result === false) {
      throw new Error();
    }

  // - 配列
  } else {
    if (!Array.isArray(value)) {
      throw new Error(prefix + name + ' : 配列ではありません');
    }

    var values = [];
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
  }
}

/**
 * 型のテスト
 *
 *  actionがcopyの場合は、このテストにパスした場合に
 *  このタイミングで複製のオブジェクトの値を設定します
 *
 * @method testType
 * @param  {String} prefix
 * @param  {String} name
 * @param  {Object} prop
 * @param  {Mixed}  value
 * @param  {String} action
 * @param  {Object} copied
 */
function testType (prefix, name, prop, value, action, copied) {
  var type;
  // 単体
  if (prop.type) {
    type = prop.type;
    var newValue = testType2(prefix, name, type, value, action);
    if (action === 'copy') {
      copied[name] = newValue;
    }

  // 配列
  } else if (prop.arrayType) {
    type = prop.arrayType;
    if (!Array.isArray(value)) {
      throw new Error(prefix + name + ' : 配列ではありません');
    }
    var values = [];
    value.forEach(function(v){
      values.push(testType2(prefix, name, type, v, action, copied));
    });
    if (action === 'copy') {
      copied[name] = values;
    }
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
 * 値がオブジェクトかつextendTypeが設定されている場合は
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
    return !value.extendType && value instanceof type;
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
  if (value.extendType) {
    Klass = value.extendType;
    if (!(Klass.prototype instanceof type)) {
      throw new Error(prefix + name +'.extendType : 指定した型は' + type.name + 'を継承していません');
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