"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HandlerBase = /** @class */ (function () {
    function HandlerBase(rule, vars) {
        this.rule = rule;
        this.vars = vars;
    }
    HandlerBase.prototype.match = function (req) {
        return true;
    };
    HandlerBase.prototype.handle = function (req) {
        return Promise.resolve({});
    };
    return HandlerBase;
}());
exports.HandlerBase = HandlerBase;
