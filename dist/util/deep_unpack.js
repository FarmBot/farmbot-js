"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var recurse = function (target, keys, val) {
    var key = keys.shift();
    var nextTarget = {};
    target[key] = nextTarget;
    if (keys.length > 0) {
        recurse(target[key], keys, val);
    }
    else {
        target[key] = val;
    }
};
function deepUnpack(path, val) {
    var target = {};
    recurse(target, path.split(constants_1.Misc.PATH_DELIM), val);
    return target;
}
exports.deepUnpack = deepUnpack;
