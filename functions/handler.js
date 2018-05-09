var request = require("request");

class Handler {
  constructor(rule, vars, http) {
    this.source = rule.source;
    this.destination = rule.destination;
    this.transform = rule.transform || new (require("./default-transform"));
    this.vars = vars;
    this.http = http || request;
  }
  match(req) {
    return true;
  }
  handle(req) {
    if (req.body.events.length == 0) {
      return Promise.reject();
    }
    return Promise.all(req.body.events.map(ev => {

      // TODO: filter event first
      if (!ev.source.userId) return Promise.resolve();

      console.log("[INFO]", "EVENT:", JSON.stringify(ev, null, 1));

      const prof = ev.source.groupId ? `group/${ev.source.groupId}/member/${ev.source.userId}` : `profile/${ev.source.userId}`;

      return Promise.resolve()
      .then(() => {
        const options = {
          uri: `https://api.line.me/v2/bot/${prof}`,
          method: 'GET',
          headers: { "Authorization": "Bearer " + this.vars.LINE_CHANNEL_ACCESS_TOKEN }
        };
        return new Promise((resolve, reject) => {
          this.http(options, (error, response, body) => {
            if (error) return reject(error);
            ev.user = JSON.parse(body);
            return resolve(ev);
          });
        });
      })
      .then(ev => {
        const options = {
          uri: this.vars.SLACK_INCOMING_WEBHOOK_URL,
          method: 'POST',
          json: this.transform.json(ev)
        };
        return new Promise((resolve, reject) => {
          this.http(options, (error, response, body) => {
            if (error) return reject(error);
            return resolve(response);
          });
        })
      });
    }));
  }
}

module.exports = Handler;