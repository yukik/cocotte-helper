/**
 * テンプレートの表示
 */

/*global Cocotte*/
var isClient = typeof window === 'object';
var helper = isClient ? Cocotte.helper : require('..');


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