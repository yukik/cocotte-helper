function Klass (config) {
}
Klass.properties = {}; // 省略

Klass.template = [
  'var config = {',
  '  name: "foo",',
  '  age: 30',
  '}'
];

var helper = require('cocotte-helper');
helper.of(Klass).template();