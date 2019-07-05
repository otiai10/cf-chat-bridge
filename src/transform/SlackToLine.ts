import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";
import Transform from "./index";

export default class SlackToLine extends Transform {
    json(payload: Slack.Callback): Promise<LINE.Message> {
        return Promise.resolve({
            text: [
                payload.userprofile.real_name || "User Unknown",
                payload.event.text || "Text Undefined",
            ].join("\n"),
            type: "text",
        } as LINE.Message);
    }
}
