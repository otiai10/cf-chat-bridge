const bridge = require("./cloud-chat-bridge");

const vars = require("./secret.json");
bridge.init(vars);

const rules = require("./rules");
const endpoint = bridge.hook("LINE").pass(rules).endpoint();

exports.line = endpoint;
