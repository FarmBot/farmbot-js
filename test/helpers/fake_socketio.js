// Just a simple stub/fake for when we need to test socket based stuff. May need
// to add more features later.
function FakeSioClient(options) {
}

// Push response data in here, in the order you want it to be pop()ed out, for
// simulation purposes.
FakeSioClient.fakeData = [];

FakeSioClient.start = function() {
    this.oldClient = window.io;
    window.io = this;
}

FakeSioClient.stop = function() {
    window.io = this.oldClient;
}

FakeSioClient.connect = function(options) {
    var connection = new FakeSioClient(options);
    connection.connected = true;
    return connection;
};

FakeSioClient.prototype.fakeResponse = function() {
    return FakeSioClient.fakeData.pop() || {};
};

FakeSioClient.prototype.on = function(event, cb) {
    cb(this.fakeResponse());
};

FakeSioClient.prototype.emit = function(name, payload, callback) {
    if (callback) { callback(this.fakeResponse()); };
};

FakeSioClient.prototype.disconnect = function(first_argument) {
    this.connected = false;
};
