module.exports = [
  {
    pipe: [
      {
        service: "LINE",
        group: "zzz-LINE-group",
      },
      {
        service: "Slack",
        channel: "zzz-random",
      }
    ]
  }
]