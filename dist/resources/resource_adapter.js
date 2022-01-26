"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAdapter = void 0;
var __1 = require("..");
var support_1 = require("./support");
var reject_rpc_1 = require("./reject_rpc");
var ResourceAdapter = /** @class */ (function () {
    function ResourceAdapter(parent, username) {
        var _this = this;
        this.parent = parent;
        this.username = username;
        this.destroy = function (r) {
            var client = _this.parent.client;
            return (client ? _this.doDestroy(client, r.kind, r.id) : (0, reject_rpc_1.rejectRpc)());
        };
        this.save = function (resource) {
            var client = _this.parent.client;
            return (client ? _this.doSave(client, resource) : (0, reject_rpc_1.rejectRpc)());
        };
        this.destroyAll = function (req) { return Promise.all(req.map(function (r) { return _this.destroy(r); })); };
        this.doDestroy = function (client, kind, id) {
            return new Promise(function (res, rej) {
                var requestId = (0, __1.uuid)();
                _this.parent.on(requestId, (0, support_1.resolveOrReject)(res, rej));
                client.publish((0, support_1.outboundChanFor)(_this.username, "destroy", kind, requestId, id), "");
            });
        };
        this.doSave = function (client, r) {
            return new Promise(function (res, rej) {
                var uid = (0, __1.uuid)();
                _this.parent.on(uid, (0, support_1.resolveOrReject)(res, rej));
                var chan = (0, support_1.outboundChanFor)(_this.username, "save", r.kind, uid, r.body.id);
                client.publish(chan, JSON.stringify(r.body));
            });
        };
    }
    return ResourceAdapter;
}());
exports.ResourceAdapter = ResourceAdapter;
