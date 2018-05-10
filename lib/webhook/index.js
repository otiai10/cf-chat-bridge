const crypto = require("crypto");
const Handler = require("../handler");

function hook(service, vars) /* Webhook */ {
  // It only suports LINE -> Slack for now
  switch (service.toUpperCase()) {
  case "LINE":
  default:
    return new LineWebhook(vars);
  }
};

class WebhookBase {
  constructor(vars) {
    this.vars = vars;
  }
  /**
   * pass parses specified rules
   * to pass the messages to other services.
   */
  pass(rules) {
    this.handlers = this.createHandlers(rules);
    return this;
  }
  /**
   * endpoint returns a function
   * which satisfy the interface
   * required by Google Cloud Functions
   */
   endpoint() {
    return (req, res) => {
      if (!this.verify(req)) {
        res.status(400).end();
        return;
      }
      Promise.all(
        this.handlers.filter(h => h.match(req)).map(h => h.handle(req))
      ).then(results => {
        console.log("[INFO]", "results", results);
        res.status(200).end();
      }).catch(err => {
        console.error("[ERROR]", err);
        res.status(500).end();
      });
    };
  }
}

class LineWebhook extends WebhookBase {
  createHandlers(rules) {
    return rules.map(rule => new Handler(rule, this.vars));
  }
  verify(req) {
    const signature = crypto.createHmac("SHA256", this.vars.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(req.body), "utf8")).digest("base64");
    return req.headers["x-line-signature"] == signature;
  }
}

module.exports = hook;
