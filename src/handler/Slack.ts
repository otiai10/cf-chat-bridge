import * as express from "express";
import Handler, { HandlerBase } from "./handler";

export default class SlackHandler extends HandlerBase implements Handler {
  public match(req: express.Request): boolean {
    if (req.body.user_name === "slackbot") {
      return false;
    }
    return true;
  }
  public handle(req: express.Request): Promise<any[]> {
    /* tslint:disable no-console */
    console.log("[DEBUG 1007]", req.body);
    return Promise.resolve([]);
  }
}
