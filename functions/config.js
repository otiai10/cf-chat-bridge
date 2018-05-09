module.exports = {
  "vars": require("./secret.json"),
  "actions": [
    {
      "source": {
        "service": "LINE",
        "group": /.*/
      },
      "destination": {
        "service": "Slack",
        "channels": [
          "bot-playground"
        ]
      },
      "transform": null
    }
  ]
}