"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("./uuid");
function rpcRequest(body, legacy) {
    var output = {
        kind: "rpc_request",
        args: { label: uuid_1.uuid(), priority: 0 },
        body: body
    };
    if (legacy) {
        delete output.args.priority;
    }
    return output;
}
exports.rpcRequest = rpcRequest;
