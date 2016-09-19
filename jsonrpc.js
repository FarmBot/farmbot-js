"use strict";
var isString = function (inp) { return (typeof inp === 'string' || inp instanceof String) && "string"; };
var isNull = function (inp) { return (String(inp) === "null") && "null"; };
var isArray = function (inp) { return (Array.isArray(inp)) && "array"; };
var isObject = function (inp) { return (typeof inp === "object") && "object"; };
var determine = function (i) { return (isArray(i) || isNull(i) || isString(i) || isObject(i) || "_"); };
function categorizeMessage(x) {
    var o = Object(x);
    var pattern = [
        determine(o.error),
        determine(o.id),
        determine(o.method),
        determine(o.params),
        determine(o.result)
    ].join(".");
    switch (pattern) {
        case "_.string.string.array._": return "request";
        case "_.null.string.array._": return "notification";
        case "null.string._.array._": return "success";
        case "object.string._._.null": return "failure";
        default:
            console.warn("Bad data received.", o);
            return "invalid";
    }
}
exports.categorizeMessage = categorizeMessage;
function tagMessage(x, disposalFn) {
    switch (Object.keys(x).sort().join(".")) {
        case "error.id.result":
        case "id.method.params":
            return { value: x, tag: categorizeMessage(x) };
        default:
            disposalFn(x);
            return { value: x, tag: "failure" };
    }
    ;
}
exports.tagMessage = tagMessage;
