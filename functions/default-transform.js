class DefaultTransform {
  constructor(request) {
    this.request = this.request;
  }
  json(ev) {
    return {
      text: ev.message.text + Date.now(),
      username: ev.user.displayName,
      icon_url: ev.user.pictureUrl,
      channel: 'bot-playground',
    };
  }
}
module.exports = DefaultTransform;