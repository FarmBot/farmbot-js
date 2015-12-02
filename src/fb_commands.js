(function() {

  function TimeoutPromise(executor, time){
    var completed = false;
    return new window.Promise(function(resolve, reject){
      executor(resolve, reject);
      setTimeout(function() {
        if (!completed) {
          reject(new Error("Operation timed out"))
        };
      }, time);
    });
  }

  FarmbotJs.commands = {
    emergency_stop: function(){
      // var payload = {
      //   message_type: 'single_command',
      //   action: 'EMERGENCY STOP'
      // };
      // var that = this;
      // var executor = function() {
      // };
      // return new Promise();
    }//,
    // exec_sequence: function(){
    //   return new Promise();
    // },
    // home_all: function(){
    //   return new Promise();
    // },
    // home_x: function(){
    //   return new Promise();
    // },
    // home_y: function(){
    //   return new Promise();
    // },
    // home_z: function(){
    //   return new Promise();
    // },
    // move_absolute: function(options){
    //   return new Promise();
    // },
    // move_relative: function(options){
    //   return new Promise();
    // },
    // pin_write: function(num, val, mode){
    //   return new Promise();
    // },
    // read_status: function(){
    //   return new Promise();
    // },
    // send_raw: function(jsObject){
    //   return new Promise();
    // },
    // sync_sequence: function(){
    //   return new Promise();
    // },
    // togglePin: function(number){
    //   return new Promise();
    // },
    // update_calibration: function(){
    //   return new Promise();
    // },
  }
})();
