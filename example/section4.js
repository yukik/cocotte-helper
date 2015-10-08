/*
 * type,arrayType,keyTypeの違い
 */

/*global Cocotte*/
var isClient = typeof window === 'object';
var helper = isClient ? Cocotte.helper : require('..');

function Klass (config) {
  helper.copy(config, this);
}
Klass.properties = {
  p_single : {
    type: String
  },
  p_array: {
    arrayType: String
  },
  p_key: {
    keyType: String
  }
};

var config = {
  p_single: 'foo',
  p_array: ['foo', 'bar'],
  p_key: {
    name1: 'foo',
    name2: 'bar'
  }
};

var instance = new Klass(config);
console.log(instance);