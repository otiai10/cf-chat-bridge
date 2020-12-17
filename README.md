# Chat Bridge by Google Cloud Functions

[![Latest Stable Version](https://img.shields.io/npm/v/cf-chat-bridge.svg)](https://www.npmjs.com/package/cf-chat-bridge)
[![CI](https://github.com/otiai10/cf-chat-bridge/workflows/CI/badge.svg)](https://github.com/otiai10/cf-chat-bridge/actions?query=workflow%3ACI)
[![codecov](https://codecov.io/gh/otiai10/cf-chat-bridge/branch/main/graph/badge.svg?token=kHey1qKbUi)](https://codecov.io/gh/otiai10/cf-chat-bridge)

Framework for **Google Cloud Functions** to bridge communications in chat services, such as

- LINE -> Slack
- Slack -> LINE

<img width="50%" src="https://user-images.githubusercontent.com/931554/39858312-25bc1a86-5471-11e8-9266-c21e257fb54d.png" />

# Example of your `index.js`

```javascript
const { Bridge } = require("cf-chat-bridge");

// Your secret variables, see following for more details.
const secrets = require("./your/secrets");
// Your rules to bridge messages, see following for more details.
const rules = require("./your/rules");

// Initialize your bridge.
const bridge = new Bridge({rules, secrets});

// Export your endpoint as a member of module,
// so that Google CloudFunctions can listen /foobar as an endpoint.
exports.foobar = bridge.endpoint();

// Then you can use following endpoints for Slack & LINE webhooks:
//   - Slack: /foobar?source=SLACK
//   - LINE:  /foobar?source=LINE
```

# Example rules

```javascript
module.exports = [

  /**
   * ONE-WAY bridge: LINE group → SLACK channel(s)
   */
  {
    // From any groups of LINE in which the bot is a member
    source: {
      service: "LINE",
      group: /.*/
    },
    // To "random" channel of Slack in which the bot is a member
    destination: {
      service: "Slack",
      channels: ["random"]
    }
  },

  /**
   * ONE-WAY bridge: Slack channel → LINE group(s)
   */
  {
    source: {
      service: "Slack",
      channel: "dev-test"
    },
    destination: {
      service: "LINE",
      to: ["C3a08fbcbd1c7c3dc4c68d42fb46bd112"],
    },
  },

  /**
   * BOTH-WAY bridge: LINE group ↔ SLACK channel
   */
  {
    pipe: [
      {
        service: "LINE",
        group: "C3a08fbcbd1c7c3dc4c68d42fb46bd112",
      },
      {
        service: "SLACK",
        channel: "general",
      },
    ]
  },
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
