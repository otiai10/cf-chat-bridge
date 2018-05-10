class DefaultTransform {
  constructor() {
  }
  json(ev) {
    switch (ev.type) {
    case "message":
    default:
      return this._message(ev);
    }
  }
  _message(ev) {
    switch (ev.message.type) {
    case "sticker":
      return this._message_sticker(ev);
    case "text":
    default:
      return this._message_text(ev);
    }
  }
  _message_text(ev) {
    return {
      text: ev.message.text,
      username: ev.user.displayName,
      icon_url: ev.user.pictureUrl,
      channel: 'bot-playground',
    };
  }
  _message_sticker(ev) {
    const url = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${ev.message.stickerId}/ANDROID/sticker.png`;
    return {
      username: ev.user.displayName,
      icon_url: ev.user.pictureUrl,
      attachments: [{"title": "", "image_url": url}],
      channel: 'bot-playground',
    };
  }
}

module.exports = DefaultTransform;