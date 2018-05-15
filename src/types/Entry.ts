import * as express from "express";
import * as LINE from "./LINE";
import * as Slack from "./Slack";

export default interface Entry {
    payload: LINE.Event | Slack.Callback;
    req: express.Request;
    transformed?: any; // TODO: Type
    skip?: boolean;
}
