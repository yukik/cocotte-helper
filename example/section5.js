/**
 * テンプレートの表示
 */


var helper = require('cocotte-helper');

function Klass () {}
Klass.properties = {}; // 設定省略

// テンプレート
Klass.template = [
  'var config = {',
  '  name: \'foo\',',
  '  age: 30',
  '};',
  'var instance = new Klass(config);'
];

helper.of(Klass).template();