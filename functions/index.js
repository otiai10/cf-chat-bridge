var request = require('request');
var config = require("./config.js");

exports.bar = (req, res) => {
    return request({
        uri: config.SlackIncomingWebhookURL(req),
        method: 'POST',
        json: {
            text: 'スクリプトからの投稿テスト',
            username: 'otiai20',
            icon_url: 'https://avatars1.githubusercontent.com/u/931554?s=460&v=4',
            channel: 'bot-playground',
        }
    }, (slackres) => {
        console.log(slackres);
        if (res) res.send(slackres);
    });
};