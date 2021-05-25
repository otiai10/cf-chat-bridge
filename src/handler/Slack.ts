import * as express from "express";
import LINEAPI from "../api/LINE";
import SLACKAPI from "../api/Slack";
import SlackToLine from "../transform/SlackToLine";
import Entry from "../types/Entry";
import Rule from "../types/Rule";
import {Service} from "../types/Service";
import * as Slack from "../types/Slack";
import Secrets from "../types/Secrets";
import { createTransforms } from "./factory";
import Handler, {Template} from "./handler";

export default class SlackHandler extends Template implements Handler {

  private LINEAPI: LINEAPI;
  private SLACKAPI: SLACKAPI;
  constructor(rule: Rule, secrets: Secrets) {
    super(rule, secrets);
    this.LINEAPI = new LINEAPI(secrets.LINE_CHANNEL_ACCESS_TOKEN);
    this.SLACKAPI = new SLACKAPI(secrets.SLACK_APP_OAUTH_ACCESS_TOKEN);
    this.transforms = createTransforms(new SlackToLine(), secrets, rule.transforms);
  }

  public match(req: express.Request): boolean {
    // Ignore if it's NOT from Slack
    if (req.query.source !== Service.SLACK) {
      return false;
    }
    // This is special request from Slack
    if (req.body.type === Slack.CallbackType.URLVerification) {
      return false;
    }
    const callback = req.body as Slack.Callback;
    if (callback.event.subtype === Slack.Subtype.BOTMESSAGE) {
      return false;
    }
    if (callback.event.thread_ts && !this.rule.source.includeThread) {
      return false;
    }
    return true;
  }

  protected entries(req: express.Request): Entry[] {
    const entry: Entry = { req, payload: req.body };
    return [entry];
  }
  protected populate(entry: Entry): Promise<Entry> {
    const payload = entry.payload as Slack.Callback;
    return this.SLACKAPI.getChannelInfo(payload.event.channel).then(channel => {
      payload.channel = channel;
      entry.payload = payload;
      return Promise.resolve(entry);
    }).then(() => {
      return this.SLACKAPI.getUserProfile(payload.event.user).then(userprofile => {
        payload.userprofile = userprofile;
        entry.payload = payload;
        return Promise.resolve(entry);
      });
    });
  }
  protected filter(entry: Entry): Promise<Entry> {
    entry.skip = true;
    const payload = entry.payload as Slack.Callback;
    if (this.rule.source.channel instanceof RegExp) {
      entry.skip = ! (this.rule.source.channel.test(payload.channel.name));
    } else if (typeof this.rule.source.channel === "string") {
      entry.skip = ! (this.rule.source.channel === payload.channel.name);
    }
    return Promise.resolve(entry);
  }

  protected distribute(entry: Entry): Promise<Entry[]> {
    return Promise.all(this.rule.destination.to.map(to => {
      return this.LINEAPI.pushMessage(to, entry.transformed);
    }));
  }
}
