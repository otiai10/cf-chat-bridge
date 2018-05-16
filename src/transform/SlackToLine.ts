import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";
import Transform from "./index";

export default class SlackToLine extends Transform {
    public json(payload: Slack.Callback): Promise<LINE.Message> {
        return Promise.resolve({
            text: payload.event.text || "UNDEFINED",
            type: "text",
        } as LINE.Message);
    }
}
