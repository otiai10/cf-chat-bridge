import * as express from "express";
import LINEAPI from "../api/LINE";
import {Service} from "../types/Service";
import Handler, { HandlerBase } from "./handler";

export default class SlackHandler extends HandlerBase implements Handler {

  private LINEAPI: LINEAPI;
  constructor(rule, vars) {
    super(rule, vars);
    this.LINEAPI = new LINEAPI(this.vars.LINE_CHANNEL_ACCESS_TOKEN);
  }
  public match(req: express.Request): boolean {
    // Ignore if it's NOT from Slack
    if (req.query.source !== Service.SLACK) {
      return false;
    }
    // Ignore if it's entry from Slack Bot
    if (req.body.user_name === "slackbot") {
      return false;
    }
    return true;
  }
  public handle(req: express.Request): Promise<any[]> {
    /* tslint:disable no-console */
    console.log("[DEBUG 1009]");
    console.log("Req.Query.Source (should be Slack)", req.query.source);
    console.log("Req.Body (should be Slack payload)", JSON.stringify(req.body));
    console.log(this.rule, this.rule.destination);
    return Promise.all([
      this.LINEAPI.pushMessage(),
    ]);
  }
}
