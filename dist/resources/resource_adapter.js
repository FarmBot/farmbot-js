"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAdapter = void 0;
const __1 = require("..");
const support_1 = require("./support");
const reject_rpc_1 = require("./reject_rpc");
class ResourceAdapter {
    constructor(parent, username) {
        this.parent = parent;
        this.username = username;
        this.destroy = (r) => {
            const { client } = this.parent;
            return (client ? this.doDestroy(client, r.kind, r.id) : (0, reject_rpc_1.rejectRpc)());
        };
        this.save = (resource) => {
            const { client } = this.parent;
            return (client ? this.doSave(client, resource) : (0, reject_rpc_1.rejectRpc)());
        };
        this.destroyAll = (req) => Promise.all(req.map(r => this.destroy(r)));
        this.doDestroy = (client, kind, id) => {
            return new Promise((res, rej) => {
                const requestId = (0, __1.uuid)();
                this.parent.on(requestId, (0, support_1.resolveOrReject)(res, rej));
                client.publish((0, support_1.outboundChanFor)(this.username, "destroy", kind, requestId, id), "");
            });
        };
        this.doSave = (client, r) => {
            return new Promise((res, rej) => {
                const uid = (0, __1.uuid)();
                this.parent.on(uid, (0, support_1.resolveOrReject)(res, rej));
                const chan = (0, support_1.outboundChanFor)(this.username, "save", r.kind, uid, r.body.id);
                client.publish(chan, JSON.stringify(r.body));
            });
        };
    }
}
exports.ResourceAdapter = ResourceAdapter;
