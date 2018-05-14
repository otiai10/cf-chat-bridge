import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";
import Transform from "./index";

export default class SlackToLine extends Transform {
    public json(ev: Slack.Event): Promise<LINE.Message> {
        return Promise.resolve({
            text: ev.text,
            type: "text",
        } as LINE.Message);
    }
}
