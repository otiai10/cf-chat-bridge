class DefaultTransform {
  constructor(request) {
    this.request = this.request;
  }
  json() {
    return {
      text: "スクリプトからの投稿: " + Date.now(),
      username: 'otiai20',
      icon_url: 'https://avatars1.githubusercontent.com/u/931554?s=460&v=4',
      channel: 'bot-playground',
    };
  }
}
module.exports = DefaultTransform;