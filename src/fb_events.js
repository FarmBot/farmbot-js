FarmbotJS.events = {

    eventHandlers: {},

    on: function(event, callback) {
        var handlers = this.eventHandlers[event] || [];
        handlers.push(callback);
        this.eventHandlers[event] = handlers;
    },
    // TODO: 'off' function
    // TODO: 'once' function

    trigger: function(event, data) {
        var handlers = this.eventHandlers[event] || [];
        handlers.forEach(function(handler){ handler(data); });
    }
};
