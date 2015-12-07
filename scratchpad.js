function registerDevice() {
  var request = new XMLHttpRequest();
  request.open('POST', '//meshblu.octoblu.com/devices?type=prototype', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  var promise = new Promise(function(reject, resolve) {
    request.onload = function() {
      var data = JSON.parse(request.responseText);
      (request.status >= 200 && request.status < 400) ? resolve(data) : reject(data);
    };

    request.onerror = function(error) {
      reject(error || "Connection error. I dunno.");
    };

    setTimeout(function() { reject(new Error("Connection timed out")) }, 3000);
  });
  request.send();
  return promise;
}

registerDevice()
  .then(function(data) { return FarmbotJS(data).connect() })
  .then(function(data) { })
  .catch(function(data) { console.dir(data || "???") });

"Done!";
