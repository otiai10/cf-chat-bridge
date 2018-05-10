
export class DefaultLineToSlackTransform {
    public json(ev) {
        switch (ev.type) {
        case "message":
        default:
            return this._message(ev);
        }
    }
    private _message(ev) {
        switch (ev.message.type) {
        case "sticker":
            return this._message_sticker(ev);
        case "text":
        default:
            return this._message_text(ev);
        }
    }
    private _message_text(ev) {
        return {
            channel: "bot-playground",
            icon_url: ev.user.pictureUrl,
            text: ev.message.text,
            username: ev.user.displayName,
        };
    }
    private _message_sticker(ev) {
        const url = this._sticker_url(ev);
        return {
            attachments: [{ title: "", image_url: url }],
            channel: "bot-playground",
            icon_url: ev.user.pictureUrl,
            username: ev.user.displayName,
        };
    }
    private _sticker_url(ev): string {
        return [
            "https://stickershop.line-scdn.net",
            "stickershop/v1/sticker",
            ev.message.stickerId,
            "ANDROID/sticker.png",
        ].join("/");
    }
}
