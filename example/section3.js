/**
 * プロパティ情報の表示
 */

/*global Cocotte*/
var isClient = typeof window === 'object';
var helper = isClient ? Cocotte.helper : require('..');

function Klass () {}
Klass.properties = {
  name: {
    type: String,
    description: ['氏名', '英名はできるだけカタカナで設定してください'],
    required: true,
    max: 30
  },
  birthday: {
    type: Date,
    description: ['誕生日', '文字列で設定できます']
  },
  address: {
    type: String,
    description: '住所'
  },
  phones: {
    arrayType: String,
    description: ['電話番号', '複数の番号に対応するため配列で設定してください'],
    regex: /^\d{2,4}-\d{2,4}-\d{4}$/
  }
};

var klassHelper = helper.of(Klass);

klassHelper.property();
klassHelper.property('name');