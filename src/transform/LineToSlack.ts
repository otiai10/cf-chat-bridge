import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";
import Transform from "./index";

export default class LineToSlack extends Transform {
    json(ev: LINE.Event): Promise<Slack.Event> {
        switch (ev.type) {
            case LINE.EventType.MESSAGE:
            default:
                return this.message(ev);
        }
    }
    private message(ev: LINE.Event): Promise<Slack.Event> {
        switch (ev.message.type) {
            case LINE.MessageType.STICKER:
                return this.messageSticker(ev);
            case LINE.MessageType.TEXT:
            default:
                return this.messageText(ev);
        }
    }
    private messageText(ev: LINE.Event): Promise<Slack.Event> {
        return Promise.resolve({
            channel: "random", // As default, overwrite me!
            icon_url: ev.user.pictureUrl,
            text: ev.message.text,
            username: ev.user.displayName,
        });
    }
    private messageSticker(ev: LINE.Event): Promise<Slack.Event> {
        const url = this.stickerURL(ev);
        return Promise.resolve({
            attachments: [{ title: "", image_url: url }],
            channel: "random", // As default, overwrite me!
            icon_url: ev.user.pictureUrl,
            username: ev.user.displayName,
        });
    }
    private stickerURL(ev: LINE.Event): string {
        return [
            "https://stickershop.line-scdn.net",
            "stickershop/v1/sticker",
            ev.message.stickerId,
            "ANDROID/sticker.png",
        ].join("/");
    }
}
