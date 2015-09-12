module.exports = function error (action) {

  var count = 0;

  return {
    /**
     * テスト開始
     * @method start
     */
    start : function () {
      count = 0;
      if (action === 'show') {
        console.log('■テスト');
      }
    },

    /**
     * エラー
     * @method callback
     * @param  {String}       prefix
     * @param  {String|Array} name
     * @param  {String}       message
     * @return {Boolean}      isErr
     */
    callback: function callback (prefix, name, message) {
      if (!message) {
        return false;
      }
      count++;
      var msg  = errMsg(prefix, name, message);
      switch(action) {
      case 'show':
        console.log(msg);
        break;
      case 'hide':
        break;
      case 'throw':
      case 'copy':
        throw new Error(msg);
      }
      return true;
    },

    /**
     * テスト終了
     * @method end
     * @return {Boolean} pass
     */
    end : function () {
      var pass = count === 0;
      if (action === 'show') {
        console.log(pass ? 'テストは成功しました' : 'テストは失敗しました');
        console.log();
      }
      return pass;
    }
  };
};


//エラーメッセージ作成
function errMsg(prefix, name, message) {

  if (Array.isArray(name)) {
    name = name.reduce(function(x, n) {
      switch (typeof n) {
      case 'number':
        x = x + '[' + n + ']';
        break;
      case 'string':
        x = x ? x + '.' + n : n;
        break;
      }
      return x;
    }, '');
  }
  return (prefix ? prefix + '.' : '') + name + ' : ' + message;
}