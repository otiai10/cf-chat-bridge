var request = require("request");

class Handler {
  constructor(action, vars, http) {
    this.source = action.source;
    this.destination = action.destination;
    this.transform = action.transform || new (require("./default-transform"));
    this.vars = vars;
    this.http = http || request;
  }
  match(req) {
    return true;
  }
  handle(req) {
    const options = {
      uri: this.vars.SLACK_INCOMING_WEBHOOK_URL,
      method: 'POST',
      json: this.transform.json(req)
    };
    return new Promise((resolve, reject) => {
      this.http(options, (error, response, body) => {
        if (error) return reject(error);
        return resolve(response);
      });
    });
  }
}

module.exports = Handler;