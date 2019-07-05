
const Bridge = require("../lib/index.js");

// Your secret variables, see following for more details.
const secrets = require("./secrets.json");
const rules = require("./rules.json");

// Initialize your bridge.
const bridge = new Bridge({ rules, secrets });
// Export your endpoint as a member of module,// so that Google CloudFunctions can listen /foobar as an endpoint.
// exports.foobar = bridge.endpoint();
console.log(bridge.endpoint());
