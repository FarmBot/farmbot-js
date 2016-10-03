"use strict";
/** ES6 Promise wrapper that adds a label and a "finished" property. */
var FBPromise = (function () {
    function FBPromise(label) {
        var _this = this;
        var $reject, $resolve;
        this.promise = new Promise(function (res, rej) {
            return _a = [rej, res], $reject = _a[0], $resolve = _a[1], _a;
            var _a;
        });
        this.finished = false;
        this.reject = function (error) {
            _this.finished = true;
            $reject.apply(_this, [error]);
        };
        this.resolve = function (value) {
            _this.finished = true;
            $resolve.apply(_this, [value]);
        };
        this.label = label || "a promise";
    }
    return FBPromise;
}());
exports.FBPromise = FBPromise;
function timerDefer(timeout, label) {
    if (label === void 0) { label = ("promise with " + timeout + " ms timeout"); }
    var that = new FBPromise(label);
    setTimeout(function () {
        if (!that.finished) {
            var failure = new Error("`" + label + "` did not execute in time");
            that.reject(failure);
        }
        ;
    }, timeout);
    return that;
}
exports.timerDefer = timerDefer;
;
