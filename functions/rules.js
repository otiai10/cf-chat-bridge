module.exports = [
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
];