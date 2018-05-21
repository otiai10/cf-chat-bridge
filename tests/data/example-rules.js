module.exports = [
  {
    source: {
      service: "LINE",
      group: "xxx-line-group",
    },
    destination: {
      service: "Slack",
      channels: ["random"],
    }
  }
]