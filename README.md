# cloud-chat-bridge

Google Cloud Functions to bridge communications in chat services to other services, for example

- LINE -> Slack
- Slack -> LINE
- etc

# What you need beforehand

`functions/secret.json`, like this

```json
{
  "LINE_CHANNEL_SECRET": "XXX",
  "LINE_CHANNEL_ACCESS_TOKEN": "XXX",
  "SLACK_INCOMING_WEBHOOK_URL": "https://hooks.slack.com/services/XXX/ZZZ"
}
```

# How to deploy

```sh
gcloud functions deploy line --trigger-http
```