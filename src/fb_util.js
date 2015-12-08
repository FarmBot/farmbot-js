FarmbotJS.util = {
  // a convinience promise wrapper.
  defer: function(label) {
    var $reject, $resolve;
    var that = new Promise(function(resolve, reject){
      $reject = reject;
      $resolve = resolve;
    });
    that.finished = false

    that.reject = function() {
      that.finished = true;
      $reject.apply(that, arguments);
    }

    that.resolve = function() {
      that.finished = true;
      $resolve.apply(that, arguments);
    }

    that.label = label || "a promise";
    return that;
  },
  // A promise that has a timeout.
  timerDefer: function(timeout, label) {
    label = label || ("promise with " + timeout + " ms timeout");
    var that = FarmbotJS.util.defer(label);
    setTimeout(function() {
      if (!that.finished) {
        var failure = new Error(label + " did not execute in time");
        that.reject(failure);
      };
    }, timeout);
    return that;
  },
  encodeFrame: function(name, payload) {
    return JSON.stringify([name, payload]);
  },
  decodeFrame: function(frameString) {
    var raw = JSON.parse(frameString)
    return {
      name: raw[0],
      message: raw[1]
    }
  },
  registerDevice: function (meshUrl, timeOut) {
      var meshUrl = meshUrl || '//meshblu.octoblu.com';
      var timeOut = timeOut || 6000;
      var request = new XMLHttpRequest();
      request.open('POST', meshUrl + '/devices?type=prototype', true);
      request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      );

      var promise = new Promise(function(resolve, reject) {
        var finished = false;

        request.onload = function() {
          finished = true;
          var data = JSON.parse(request.responseText);
          var allIsWell = (request.status >= 200 && request.status < 400);
          return allIsWell ? resolve(data) : reject(data);
        };

        request.onerror = function(error) {
          if (!finished) {
            reject(error || "Connection error. I dunno.");
          };
        };

        setTimeout(function() {
          console.warn("Device Registration Timed out.")
          reject(new Error("Connection timed out"))
        }, timeOut);
      });
      request.send();
      return promise;
  },

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
    var randomHex = function() {
      var num = (1 + Math.random()) * 0x10000;
      return Math.floor(num).toString(16).substring(1);
    }
    var i = 10;
    var results = [];
    while (i--) {
      results.push(randomHex());
    }
    return results.join('');
  }
}
