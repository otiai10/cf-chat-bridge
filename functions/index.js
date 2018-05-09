var config = require("./config");
var Handler = require("./handler");

const handlers = config.actions.map(action => new Handler(action, config.vars));

exports.line = (req, response) => {
    Promise.all(handlers.filter(handler => handler.match(req)).map(handler => handler.handle(req)))
    .then(results => {
        if (response) response.send(results);
        console.log(results);
    });
};
