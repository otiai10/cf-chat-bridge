"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var handler_1 = require("./handler");
var LineHandler = /** @class */ (function (_super) {
    __extends(LineHandler, _super);
    function LineHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineHandler.prototype.verify = function (req) {
        return true;
    };
    LineHandler.prototype.populate = function (req) {
        return req;
    };
    return LineHandler;
}(handler_1.HandlerBase));
exports.default = LineHandler;
