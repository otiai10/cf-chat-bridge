# Chat Bridge by Google Cloud Functions

Framework for **Google Cloud Functions** to bridge communications in chat services, such as

- LINE -> Slack
- Slack -> LINE

<img width="50%" src="https://user-images.githubusercontent.com/931554/39858312-25bc1a86-5471-11e8-9266-c21e257fb54d.png" />

# Example of your `index.js`

```javascript
const bridge = require("cf-chat-bridge");

// Your secret variables, see following for details
const vars = require("./secret.json");
const app = bridge.init({vars});

// Your rules to bridge messages, see following for details
const rules = require("./rules");
const endpoint = app.webhook(rules);

exports.foobar = endpoint;
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
  "LINE_CHANNEL_SECRET": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "LINE_CHANNEL_ACCESS_TOKEN": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "SLACK_APP_VERIFICATION_TOKEN": "xxxxxxxxxxxxxxxxxxxxx",
  "SLACK_APP_BOT_ACCESS_TOKEN": "xoxb-xxxxxxxxxxxxxxxxxx"
}
```

- `LINE_CHANNEL_SECRET`
  - can be get when you create provider and bot channel in LINE developer console.
- `LINE_CHANNEL_ACCESS_TOKEN`
  - can be created when you create provider and bot channel in LINE developer console.
- `SLACK_APP_VERIFICATION_TOKEN`
  - is created when you create an App on your slack team.
- `SLACK_APP_BOT_ACCESS_TOKEN`
  - is created when you create a bot user belonging to the App you created.

# How to deploy your `index.js` to Google Cloud Functions

```sh
gcloud functions deploy foobar --trigger-http
```

See links below for more information

- [Cloud Functions - Event-driven Serverless Computing | Google Cloud](https://cloud.google.com/functions/)