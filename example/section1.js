var helper = require('cocotte-helper');

function Foo (config) {
  helper.copy(config, this);
}

Foo.properties = {
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  }
};

var foo = new Foo({name: 'foo', age: 10});

console.log(foo);
