/**
 * テンプレートの表示
 */


var helper = require('cocotte-helper');

function Klass () {}
Klass.properties = {}; // 省略

// テンプレート
Klass.template = [
  'var config = {',
  '  name: "foo",',
  '  age: 30',
  '}'
];

helper.of(Klass).template();