"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var service_1 = require("./service");
var Verifier = /** @class */ (function () {
    function Verifier(vars) {
        this.vars = vars;
    }
    Verifier.prototype.verify = function (req) {
        switch (req.query.source.toUpperCase()) {
            case service_1.Service.LINE:
            default:
                return this.verifyLine(req);
        }
    };
    Verifier.prototype.verifyLine = function (req) {
        var hmac = crypto.createHmac("SHA256", this.vars.LINE_CHANNEL_SECRET);
        hmac = hmac.update(new Buffer(JSON.stringify(req.body), "utf8"));
        return req.headers["x-line-signature"] === hmac.digest("base64");
    };
    return Verifier;
}());
exports.default = Verifier;
