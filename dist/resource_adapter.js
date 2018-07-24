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
        this.outboundChanFor = function (req, uuid_) { return [
            "bot",
            _this.username,
            "resources_v0",
            "destroy",
            "" + req.name,
            "" + req.id,
            "" + uuid_,
        ].join("/"); };
        this.destroy = function (req) {
            var client = _this.parent.client;
            if (client) {
                return new Promise(function (res, rej) {
                    // Generate a UUID
                    var requestId = _1.uuid();
                    // Figure out which channel it needs to be published to.
                    var outputChan = _this.outboundChanFor(req, requestId);
                    // Setup the response handler.
                    _this
                        .parent
                        .on(requestId, function (m) {
                        (m.kind == "rpc_ok" ? res : rej)(m);
                    });
                    client.publish(outputChan, "");
                });
            }
            // Auto-reject if client is not connected yet.
            var internalError = {
                kind: "rpc_error",
                args: {
                    label: "BROWSER_LEVEL_FAILURE"
                },
                body: [
                    {
                        kind: "explanation",
                        args: {
                            message: "Tried to perform batch operation before connect."
                        }
                    }
                ]
            };
            return Promise.reject(internalError);
        };
        this.destroyAll = function (req) { return Promise.all(req.map(function (r) { return _this.destroy(r); })); };
    }
    return ResourceAdapter;
}());
exports.ResourceAdapter = ResourceAdapter;
