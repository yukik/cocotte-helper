/*
 * type,arrayType,keyTypeの違い
 */


var helper = require('cocotte-helper');

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