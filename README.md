# cloud-chat-bridge

Framework for **Google Cloud Functions** to bridge communications in chat services to others, such as

- LINE -> Slack
- ~~Slack -> LINE~~ <- coming soon

<img width="50%" src="https://user-images.githubusercontent.com/931554/39858312-25bc1a86-5471-11e8-9266-c21e257fb54d.png" />

# Example of your `index.js`

```javascript
const bridge = require("cloud-chat-bridge");

// Your secret variables, see following for details
const vars = require("./secret.json");
const app = bridge.init({vars});

// Your rules to bridge messages, see following for details
const rules = require("./rules");
const endpoint = app.webhook(rules);

exports.webhook = endpoint;
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