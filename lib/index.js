"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory_1 = require("./factory");
var verifier_1 = require("./verifier");
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
        this.verifier = new verifier_1.default(this.vars);
    }
    App.prototype.webhook = function (rules) {
        this.handlers = this.createHandlers(rules);
        return this.dispatch.bind(this);
    };
    App.prototype.dispatch = function (req, res) {
        if (!this.verifier.verify(req)) {
            return res.status(400).end();
        }
        Promise.all(this.handlers.filter(function (h) { return h.match(req); }).map(function (h) { return h.handle(req); })).then(function (results) {
            res.status(200).json(results);
        }).catch(function (err) {
            res.status(500).json(err);
        });
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
