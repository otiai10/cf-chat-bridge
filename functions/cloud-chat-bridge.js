/**
 * This file should be separated as NPM package in near future.
 * See https://github.com/otiai10/cloud-chat-bridge/issues/2 to track this topic.
 */

// {{{ File: init.js
var __vars = {};
const init = (vars) => {
  // TODO: Check the best practice of initializing module variables
  __vars = vars;
};
// }}}

// {{{ File: transform.js
class DefaultTransform {
  constructor() {
  }
  json(ev) {
    switch (ev.type) {
    case "message":
    default:
      return this._message(ev);
    }
  }
  _message(ev) {
    switch (ev.message.type) {
    case "sticker":
      return this._message_sticker(ev);
    case "text":
    default:
      return this._message_text(ev);
    }
  }
  _message_text(ev) {
    return {
      text: ev.message.text,
      username: ev.user.displayName,
      icon_url: ev.user.pictureUrl,
      channel: 'bot-playground',
    };
  }
  _message_sticker(ev) {
    const url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${ev.message.stickerId}/ANDROID/sticker.png`;
    return {
      username: ev.user.displayName,
      icon_url: ev.user.pictureUrl,
      attachments: [{"title": "", "image_url": url}],
      channel: 'bot-playground',
    };
  }
}
// }}}

// {{{ File: handler.js
var request = require("request");
class Handler {
  constructor(rule, vars, http) {
    this.source = rule.source;
    this.destination = rule.destination;
    this.transform = rule.transform || new DefaultTransform();
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
// }}}

// {{{ File: hook.js
function hook(service) /* Webhook */ {
  // It only suports LINE -> Slack for now
  switch (service.toUpperCase()) {
  case "LINE":
  default:
    return new LineWebHook();
  }
};

class Webhook {
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
// }}}

// {{{ File: hook_line.js
var crypto = require("crypto");
class LineWebHook extends Webhook {
  createHandlers(rules) {
    return rules.map(rule => new Handler(rule, __vars));
  }
  verify(req) {
    const signature = crypto.createHmac("SHA256", __vars.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(req.body), "utf8")).digest("base64");
    return req.headers["x-line-signature"] == signature;
  }
}
// }}}

// exports.line = (req, res) => {
//     if (!authenticated(req)) {
//         return res.status(401).end();
//     }
//     Promise.all(handlers.filter(handler => handler.match(req)).map(handler => handler.handle(req)))
//     .then(results => {
//         if (res) res.send(results);
//         // console.log(results);
//     });
// };

module.exports = {
  init,
  hook,
};