// TODO: 'off' function
// TODO: 'once' function
FarmbotJS.events = {
  event: function(name) {
    this.__events = this.__events || {};
    this.__events[name] = this.__events[name] || [];
    return this.__events[name];
  },

  on: function(event, callback) {
    this.event(event).push(callback);
  },

  emit: function(event, data) {
    this.event(event).forEach(function(handler) { handler(data); });
  }
};
