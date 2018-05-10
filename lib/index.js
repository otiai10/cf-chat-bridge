const webhook = require("./webhook");

const init = (vars) => {
  global.__vars = vars || {};
};

const hook = (service) => {
  global.__vars = global.__vars || {};
  return webhook(service, global.__vars);
};

module.exports = {
  init,
  hook,
};