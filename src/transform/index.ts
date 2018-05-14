import * as LINE from "../types/LINE";

export class DefaultLineToSlackTransform {
    public json(ev: LINE.Event) {
        switch (ev.type) {
        case LINE.EvenType.MESSAGE:
        default:
            return this._message(ev);
        }
    }
    private _message(ev: LINE.Event) {
        switch (ev.message.type) {
        case LINE.MessageType.STICKER:
            return this._message_sticker(ev);
        case LINE.MessageType.TEXT:
        default:
            return this._message_text(ev);
        }
    }
    private _message_text(ev: LINE.Event) {
        return {
            channel: "bot-playground",
            icon_url: ev.user.pictureUrl,
            text: ev.message.text,
            username: ev.user.displayName,
        };
    }
    private _message_sticker(ev: LINE.Event) {
        const url = this._sticker_url(ev);
        return {
            attachments: [{ title: "", image_url: url }],
            channel: "bot-playground",
            icon_url: ev.user.pictureUrl,
            username: ev.user.displayName,
        };
    }
    private _sticker_url(ev: LINE.Event): string {
        return [
            "https://stickershop.line-scdn.net",
            "stickershop/v1/sticker",
            ev.message.stickerId,
            "ANDROID/sticker.png",
        ].join("/");
    }
}
