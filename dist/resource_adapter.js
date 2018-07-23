"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var ResourceName;
(function (ResourceName) {
    ResourceName["FarmEvent"] = "FarmEvent";
    ResourceName["FarmwareInstallations"] = "FarmwareInstallation";
    ResourceName["Image"] = "Image";
    ResourceName["Log"] = "Log";
    ResourceName["Peripheral"] = "Peripheral";
    ResourceName["PinBinding"] = "PinBinding";
    ResourceName["PlantTemplate"] = "PlantTemplate";
    ResourceName["Point"] = "Point";
    ResourceName["Regimen"] = "Regimen";
    ResourceName["SavedGarden"] = "SavedGarden";
    ResourceName["Sensor"] = "Sensor";
    ResourceName["SensorReading"] = "SensorReading";
    ResourceName["Sequence"] = "Sequence";
    ResourceName["Tool"] = "Tool";
    ResourceName["WebcamFeed"] = "WebcamFeed";
})(ResourceName = exports.ResourceName || (exports.ResourceName = {}));
var ResourceAdapter = /** @class */ (function () {
    function ResourceAdapter(parent, username) {
        var _this = this;
        this.parent = parent;
        this.username = username;
        this.cache = {};
        this.outboundChanFor = function (req, uuid_) { return [
            "bot",
            _this.username,
            "resources_v0",
            "" + req.name,
            "" + req.id,
            "" + uuid_,
        ].join("/"); };
        this.inboundChannelFor = function (req) { return [
            "bot",
            _this.username,
            "from_api",
            "" + req.id,
        ].join("/"); };
        this.destroy = function (req) {
            var client = _this.parent.client;
            if (client) {
                client.emit(-1);
                // Generate a UUID
                var requestId = _1.uuid();
                var outputChan = _this.outboundChanFor(req, requestId);
                var p = new Promise(function (resolve, _reject) {
                    _this.parent.on(_this.inboundChannelFor(req), function () {
                        resolve();
                        throw new Error("Stopped here");
                    });
                });
                // Put it in the cache
                _this.cache[requestId] = p;
                // Subscribe to response chan
                // publish RPC
                // return promise
                return p;
            }
            return Promise.reject();
        };
    }
    return ResourceAdapter;
}());
exports.ResourceAdapter = ResourceAdapter;
