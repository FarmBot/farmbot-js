"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("./uuid");
var Priority;
(function (Priority) {
    Priority[Priority["HIGHEST"] = 9000] = "HIGHEST";
    Priority[Priority["NORMAL"] = 600] = "NORMAL";
    Priority[Priority["LOWEST"] = 300] = "LOWEST";
})(Priority = exports.Priority || (exports.Priority = {}));
exports.rpcRequest = function (body, legacy, priority) {
    if (priority === void 0) { priority = Priority.NORMAL; }
    var output = { kind: "rpc_request", args: { label: uuid_1.uuid(), priority: priority }, body: body };
    if (legacy) {
        delete output.args.priority;
    }
    return output;
};
