Farmbot.prototype.emergencyStop = function() {
    return this.send({
        params: {},
        method: "single_command.EMERGENCY STOP"
    });
}

Farmbot.config = {
    requiredOptions: ["uuid", "token", "meshServer", "timeout"],
    defaultOptions: {
        meshServer: 'meshblu.octoblu.com', // 'mesh.farmbot.io', 'wss://meshblu.octoblu.com/socket.io', //'ws://meshblu.octoblu.com/ws/v2',// 'ws://mesh.farmbot.io',
        timeout: 5000
    }
}

Farmbot.prototype.event = function(name) {
    this.__events = this.__events || {};
    this.__events[name] = this.__events[name] || [];
    return this.__events[name];
};

Farmbot.prototype.on = function(event, callback) {
    this.event(event).push(callback);
};

Farmbot.prototype.emit = function(event, data) {
    this.event(event).forEach(function(handler) {
        handler(data);
    });
}

Farmbot.prototype.buildMessage = function(input) {
    var msg = input || {};
    var metaData = {
        devices: (msg.devices || this.options.uuid),
        id: (msg.id || Farmbot.uuid())
    };
    Farmbot.extend(msg, [metaData]);
    Farmbot.requireKeys(msg, ["params", "method", "devices", "id"]);
    return msg;
};

Farmbot.prototype.sendRaw = function(input) {
    if (this.socket) {
        var msg = this.buildMessage(input);
        this.socket.send(JSON.stringify(["message", msg]));
        return msg;
    } else {
        throw new Error("You must connect() before sending data");
    };
};

Farmbot.prototype.send = function(input) {
    var that = this;
    var msg = that.sendRaw(input);
    var promise = Farmbot.timerDefer(that.options.timeout,
        msg.method + " " + msg.params);
    that.on(msg.id, function(response) {
        var respond = (response && response.result) ? promise.resolve : promise.reject;
        respond(response);
    })
    return promise
};

Farmbot.prototype.__newSocket = function() { // for easier testing.
    return new WebSocket("ws://" + this.options.meshServer + "/ws/v2");
};
Farmbot.prototype.__onmessage = function(e) {
    var msg = Farmbot.decodeFrame(e.data);
    var id = msg.message.id;
    if (id) {
        this.emit(id, msg.message);
    } else {
        this.emit(msg.name, msg.message);
    };
};

Farmbot.prototype.__newConnection = function(credentials) {
    var that = this;
    var promise = Farmbot.timerDefer(that.options.timeout,
        "__newConnection");
    that.socket = that.__newSocket();
    that.socket.onopen = function() {
        that.socket.send(Farmbot.encodeFrame("identity", credentials));
    };
    that.socket.onmessage = that.__onmessage.bind(that);
    that.on("ready", function() {
        promise.resolve(that)
    });
    return promise;
}

Farmbot.prototype.connect = function() {
    var that = this;
    return new window.Promise(function(resolve, reject) {
        function subscribe() {
            that.socket.send(Farmbot.encodeFrame("subscribe", that));
            resolve(that);
        }
        Farmbot.registerDevice()
            .then(that.__newConnection.bind(that))
            .then(subscribe)
    });
}

// a convinience promise wrapper.
Farmbot.defer = function(label) {
    var $reject, $resolve;
    var that = new Promise(function(resolve, reject) {
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
};

Farmbot.timerDefer = function(timeout, label) {
    label = label || ("promise with " + timeout + " ms timeout");
    var that = Farmbot.defer(label);
    setTimeout(function() {
        if (!that.finished) {
            var failure = new Error(label + " did not execute in time");
            that.reject(failure);
        };
    }, timeout);
    return that;
};

Farmbot.encodeFrame = function(name, payload) {
    return JSON.stringify([name, payload]);
};

Farmbot.decodeFrame = function(frameString) {
    var raw = JSON.parse(frameString)
    return {
        name: raw[0],
        message: raw[1]
    }
};

Farmbot.registerDevice = function(meshUrl, timeOut) {
    var meshUrl = meshUrl || '//meshblu.octoblu.com';
    var timeOut = timeOut || 6000;
    var request = new XMLHttpRequest();
    var promise = Farmbot.timerDefer(timeOut, "registering device");
    request.open('POST', meshUrl + '/devices?type=prototype', true);
    request.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.onload = function() {
        var data = JSON.parse(request.responseText);
        var allIsWell = (request.status >= 200 && request.status < 400);
        return allIsWell ? promise.resolve(data) : promise.reject(data);
    };
    request.onerror = promise.reject
    request.send();
    return promise;
}

Farmbot.extend = function(target, mixins) {
    mixins.forEach(function(mixin) {
        var iterate = function(prop) {
            target[prop] = mixin[prop];
        };
        Object.keys(mixin).forEach(iterate);
    });
    return target;
};

Farmbot.requireKeys = function(input, required) {
    required.forEach(function(prop) {
        if (!input[prop]) {
            throw (new Error("Expected input object to have `" + prop +
                "` property"));
        }
    });
};

Farmbot.uuid = function() {
    var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var replaceChar = function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    };
    return template.replace(/[xy]/g, replaceChar);
};

// This function isn't clever enough.
Farmbot.token = function() {
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
};

Farmbot.MeshErrorResponse = function(input) {
    return {
        error: {
            method: "error",
            error: input || "unspecified error"
        }
    }
}

function Farmbot(input) {
    if(!(this instanceof Farmbot)) { return new Farmbot(input); }
    this.options = {};
    Farmbot.extend(this.options, [Farmbot.config.defaultOptions, input]);
    Farmbot.requireKeys(this.options, Farmbot.config.requiredOptions);
}
