import * as express from "express";

import LineToSlack from "../transform/LineToSlack";
import Entry from "../types/Entry";
import * as LINE from "../types/LINE";
import Rule from "../types/Rule";
import { Service } from "../types/Service";
import * as Slack from "../types/Slack";
import Variables from "../types/Vars";
import {createTransforms} from "./factory";
import Handler, {Template} from "./handler";

import LINEAPI from "../api/LINE";
import SLACKAPI from "../api/Slack";

/**
 * LineHandler handles webhooks from LINE,
 * distributing the entry to other services
 * according to given "Rule".
 */
export default class LineHandler extends Template implements Handler {

  private LINEAPI: LINEAPI;
  private SLACKAPI: SLACKAPI;

  constructor(rule: Rule, vars: Variables) {
    super(rule, vars);
    this.LINEAPI = new LINEAPI(vars.LINE_CHANNEL_ACCESS_TOKEN);
    this.SLACKAPI = new SLACKAPI(vars.SLACK_APP_OAUTH_ACCESS_TOKEN);
    this.transforms = createTransforms(new LineToSlack(), vars, rule.transforms);
  }

  /**
   * match check the request and judge if this Handler should handle this request.
   * @param req express.Request
   */
  public match(req: express.Request): boolean {
    if ((req.query.source || "").toUpperCase() !== Service.LINE) {
      return false;
    }
    return true;
  }

  protected entries(req: express.Request): Entry[] {
    return req.body.events.map(event => ({payload: event, req}));
  }

  protected populate(entry: Entry): Promise<Entry> {
    const payload = entry.payload as LINE.Event;
    return this.LINEAPI.getSourceProfile(payload.source).then(user => {
      payload.user = user;
      entry.payload = payload;
      return Promise.resolve(entry);
    });
  }

  protected filter(entry: Entry): Promise<Entry> {
    /* tslint:disable no-console */
    console.log("[LINE][0000]", JSON.stringify(entry.payload));
    const payload = entry.payload as LINE.Event;

    // FIXME: rule.group should be RegExp and should be filtered by name, however,
    //        there is no way to get Group "Name" by ID so far.
    //        https://engineering.linecorp.com/ja/blog/detail/115#2_4
    entry.skip = true;
    if (typeof this.rule.source.group === "string") {
      entry.skip = (this.rule.source.group !== payload.source.groupId);
    }

    return Promise.resolve(entry);
  }

  protected distribute(entry: Entry): Promise<any[]> {
    const message = entry.transformed as Slack.Event;
    return Promise.all(
      (this.rule.destination.channels || []).map(channel => {
        const m = Object.assign(message, {channel});
        return this.SLACKAPI.postMessage(m);
      }),
    );
  }
}
