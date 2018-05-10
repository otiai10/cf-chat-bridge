"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("./factory");
function init(options) {
    if (options === void 0) { options = {}; }
    return new App(options);
}
exports.init = init;
var App = /** @class */ (function () {
    function App(options) {
        this.vars = {};
        this.handlers = [];
        this.vars = options.vars || {};
    }
    App.prototype.webhook = function (rules) {
        var _this = this;
        this.handlers = this.createHandlers(rules);
        return function (req, res) {
            _this.handlers.filter(function (h) { return h.match(req); }).map(function (h) { return h.handle(req); });
            res.status(200).end();
        };
    };
    App.prototype.createHandlers = function (rules) {
        var _this = this;
        if (rules === void 0) { rules = []; }
        return rules.map(function (rule) {
            return factory_1.createHandler(rule, _this.vars);
        });
    };
    return App;
}());
exports.default = App;
