  // TODO: 'off' function
  // TODO: 'once' function

FarmbotJS.events = {
  event: function(name) {
    if (!this.events) { this.events = {}; };
    if (!this.events[name]) { this.events[name] = []; };
    return this.events[name];
  },

  on: function(event, callback) {
    this.event(event).push(callback);
  },

  trigger: function(event, data) {
    this.event(event).forEach(function(handler){ handler(data); });
  }
};
