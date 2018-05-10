"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handler_line_1 = require("./handler_line");
function createHandler(rule, vars) {
    return new handler_line_1.default(rule, vars);
}
exports.createHandler = createHandler;
