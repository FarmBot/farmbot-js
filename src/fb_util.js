FarmbotJS.util = {
  extend: function(target, mixins) {
    mixins.forEach(function(mixin) {
      var iterate = function(prop) {
        target[prop] = mixin[prop];
      };
      Object.keys(mixin).forEach(iterate);
    });
    return target;
  },

  requireKeys: function(input, required) {
    required.forEach(function(prop) {
      if (!input[prop]) {
        throw (new Error("Expected input object to have `" + prop +
          "` property"));
      }
    });
  },

  uuid: function() {
    var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var replaceChar = function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
  },
  // This function isn't clever enough.
  token: function() {
    var randomHex = function(){
      return Math.
        floor((1 + Math.random()) * 0x10000).
        toString(16).
        substring(1);
    }
    var i = 10;
    var results = [];
    while(i--) {
      results.push(randomHex());
    }
    return results.join('');
  }
}
