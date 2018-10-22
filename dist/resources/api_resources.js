"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ToolPulloutDirection;
(function (ToolPulloutDirection) {
    ToolPulloutDirection[ToolPulloutDirection["NONE"] = 0] = "NONE";
    ToolPulloutDirection[ToolPulloutDirection["POSITIVE_X"] = 1] = "POSITIVE_X";
    ToolPulloutDirection[ToolPulloutDirection["NEGATIVE_X"] = 2] = "NEGATIVE_X";
    ToolPulloutDirection[ToolPulloutDirection["POSITIVE_Y"] = 3] = "POSITIVE_Y";
    ToolPulloutDirection[ToolPulloutDirection["NEGATIVE_Y"] = 4] = "NEGATIVE_Y";
})(ToolPulloutDirection = exports.ToolPulloutDirection || (exports.ToolPulloutDirection = {}));
var PinBindingType;
(function (PinBindingType) {
    PinBindingType["special"] = "special";
    PinBindingType["standard"] = "standard";
})(PinBindingType = exports.PinBindingType || (exports.PinBindingType = {}));
var PinBindingSpecialAction;
(function (PinBindingSpecialAction) {
    PinBindingSpecialAction["emergency_lock"] = "emergency_lock";
    PinBindingSpecialAction["emergency_unlock"] = "emergency_unlock";
    PinBindingSpecialAction["sync"] = "sync";
    PinBindingSpecialAction["reboot"] = "reboot";
    PinBindingSpecialAction["power_off"] = "power_off";
    PinBindingSpecialAction["dump_info"] = "dump_info";
    PinBindingSpecialAction["read_status"] = "read_status";
    PinBindingSpecialAction["take_photo"] = "take_photo";
})(PinBindingSpecialAction = exports.PinBindingSpecialAction || (exports.PinBindingSpecialAction = {}));
