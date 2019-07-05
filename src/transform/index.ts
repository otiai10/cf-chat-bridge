import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";

export default abstract class Transform {
    public abstract json(ev: LINE.Event | Slack.Callback): Promise<any>;
}
