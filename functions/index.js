var config = require("./config");
var Handler = require("./handler");
var crypto = require('crypto');


const handlers = config.actions.map(action => new Handler(action, config.vars));

const authenticated = (req) => {
    const signature = crypto.createHmac("SHA256", config.vars.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(req.body), "utf8")).digest("base64");
    return req.headers["x-line-signature"] == signature;
};

exports.line = (req, res) => {
    if (!authenticated(req)) {
        return res.status(401).end();
    }
    Promise.all(handlers.filter(handler => handler.match(req)).map(handler => handler.handle(req)))
    .then(results => {
        if (res) res.send(results);
        // console.log(results);
    });
};
