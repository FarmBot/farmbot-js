"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mockUuid = "123-456";
jest.mock("../../util/uuid", function () { return ({ uuid: function () { return mockUuid; } }); });
jest.mock("../reject_rpc", function () { return ({
    rejectRpc: jest.fn(function () { return Promise.reject({
        kind: "rpc_error",
        args: { label: "BROWSER_LEVEL_FAILURE" },
        body: [
            {
                kind: "explanation",
                args: { message: "Tried to perform batch operation before connect." }
            }
        ]
    }); })
}); });
var test_support_1 = require("../../test_support");
var resource_adapter_1 = require("../resource_adapter");
var support_1 = require("../support");
var reject_rpc_1 = require("../reject_rpc");
describe("resourceAdapter", function () {
    var username = "device_87";
    it("destroys all", function () {
        var fakeFb = test_support_1.fakeFarmbotLike();
        var ra = new resource_adapter_1.ResourceAdapter(fakeFb, username);
        var requests = [{ kind: "Point", id: 4 }, { kind: "Sequence", id: 4 }];
        ra.destroyAll(requests).then(function () { }, function () { });
        requests.map(function (req) {
            var _a;
            var client = fakeFb.client;
            var expectedArgs = [support_1.outboundChanFor(username, "destroy", req.kind, mockUuid, req.id), ""];
            (_a = expect(client && client.publish)).toHaveBeenCalledWith.apply(_a, expectedArgs);
        });
    });
    it("handles a missing `client`", function () {
        var fakeFb = test_support_1.fakeFarmbotLike();
        fakeFb.client = undefined;
        var ra = new resource_adapter_1.ResourceAdapter(fakeFb, username);
        ra.destroy({ kind: "Point", id: 4 }).then(function () { }, function () { });
        expect(reject_rpc_1.rejectRpc).toHaveBeenCalled();
    });
});
