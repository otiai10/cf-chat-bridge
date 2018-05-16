import * as express from "express";
import LINEAPI from "../api/LINE";
import Transform from "../transform";
import SlackToLine from "../transform/SlackToLine";
import Entry from "../types/Entry";
import {Service} from "../types/Service";
import * as Slack from "../types/Slack";
import Handler, {Template} from "./handler";

export default class SlackHandler extends Template implements Handler {

  private LINEAPI: LINEAPI;
  private transformer: Transform;
  constructor(rule, vars) {
    super(rule, vars);
    this.LINEAPI = new LINEAPI(this.vars.LINE_CHANNEL_ACCESS_TOKEN);
    this.transformer = rule.transform ? rule.transform : new SlackToLine();
  }

  public match(req: express.Request): boolean {
    // Ignore if it's NOT from Slack
    if (req.query.source !== Service.SLACK) {
      return false;
    }
    // This is special request from Slack
    if (req.body.type === "url_verification") {
      return false;
    }
    // Ignore if it's entry from Slack Bot
    if (req.body.user_name === "slackbot") {
      return false;
    }
    return true;
  }

  protected entries(req: express.Request): Entry[] {
    const entry = {req, payload: req.body as Slack.Callback} as Entry;
    return [entry];
  }
  protected populate(entry: Entry): Promise<Entry> {
    return Promise.resolve(entry);
  }
  protected filter(entry: Entry): Promise<Entry> {
    return Promise.resolve(entry);
  }
  protected transform(entry: Entry): Promise<Entry> {
    /* tslint:disable no-console */
    console.log("[SLACK][0000]", JSON.stringify(entry.payload));
    return this.transformer.json(entry.payload).then(transformed => {
      entry.transformed = transformed;
      return Promise.resolve(entry);
    });
  }
  protected distribute(entry: Entry): Promise<Entry[]> {
    return Promise.all(this.rule.destination.to.map(to => {
      return this.LINEAPI.pushMessage(to, entry.transformed);
    }));
  }
}
