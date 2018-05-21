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
  "SLACK_APP_OAUTH_ACCESS_TOKEN": "xoxp-xxxxxxxxxxxxxxxxxx"
}
```

- `LINE_CHANNEL_SECRET`
  - Secret key to verify request triggered from LINE webhook
  - Created when you create `a channel` on https://developers.line.me/console/
- `LINE_CHANNEL_ACCESS_TOKEN`
  - Access token to send message to LINE
  - Created when you create `a channel` on https://developers.line.me/console/
- `SLACK_APP_VERIFICATION_TOKEN`
  - Secret key to verify request triggered from Slack webhook
  - Created when you create `an app` on https://api.slack.com/apps
    - and enable [**Events API**](https://api.slack.com/events-api)
- `SLACK_APP_OAUTH_ACCESS_TOKEN`
  - Access token to send message to Slack
  - Created when you create `an app` on https://api.slack.com/apps
    - and install the app to your workspace

See https://github.com/otiai10/cf-chat-bridge/wiki/Getting-Started for more information about getting started.

# How to deploy your `index.js` to Google Cloud Functions

```sh
gcloud functions deploy foobar --trigger-http
```

See links below for more information

- [Cloud Functions - Event-driven Serverless Computing | Google Cloud](https://cloud.google.com/functions/)