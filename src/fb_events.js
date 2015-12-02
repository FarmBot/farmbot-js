// TODO: 'off' function
// TODO: 'once' function
// NOTE: We don't use this right now, but we will when we remove socket.io from
//       the project.
FarmbotJS.events = {
  event: function(name) {
    if (!this.events) { this.events = {}; };
    if (!this.events[name]) { this.events[name] = []; };
    return this.events[name];
  },

  on: function(event, callback) {
    this.event(event).push(callback);
  },

  emit: function(event, data) {
    this.event(event).forEach(function(handler){ handler(data); });
  }
};
