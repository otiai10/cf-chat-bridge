# cloud-chat-bridge

Framework for **Google Cloud Functions** to bridge communications in chat services to others, such as

- LINE -> Slack
- ~~Slack -> LINE~~ <- coming soon

# Example of your `index.js`

```javascript
const bridge = require("cloud-chat-bridge");

// Your secret variables, see following for details
const vars = require("./secret.json");
bridge.init(vars);

// Your rules to bridge messages, see following for details
const rules = require("./rules");
const endpoint = bridge.hook("LINE").pass(rules).endpoint();

// Specify endpoint for Google Cloud Functions.
exports.webhook_line = endpoint;
```

# Example rules

```javascript
module.exports = [
  {
    // From any groups of LINE
    "source": {
      "group": /.*/
    },
    // To "random" channel of Slack
    "destination": {
      "service": "Slack",
      "channels": ["random"]
    }
  }
]
```

# Variables you might need

`secret.json`, like this

```json
{
  "LINE_CHANNEL_SECRET": "XXXXXX",
  "LINE_CHANNEL_ACCESS_TOKEN": "XXX",
  "SLACK_INCOMING_WEBHOOK_URL": "https://hooks.slack.com/services/XXX/ZZZ"
}
```

- `LINE_CHANNEL_SECRET`
  - can be get when you create provider and bot channel in LINE developer console.
- `LINE_CHANNEL_ACCESS_TOKEN`
  - can be created when you create provider and bot channel in LINE developer console.
- `SLACK_INCOMING_WEBHOOK_URL`
  - can be created when you enable `incoming-webhook` in Slack console.

# How to deploy your `index.js` to Google Cloud Functions

```sh
gcloud functions deploy webhook_line --trigger-http
```

See links below for more information

- [Cloud Functions - Event-driven Serverless Computing | Google Cloud](https://cloud.google.com/functions/)