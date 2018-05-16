import * as express from "express";

import { IVariables } from "..";
import Transform from "../transform";
import LineToSlack from "../transform/LineToSlack";
import Entry from "../types/Entry";
import Rule from "../types/Rule";
import { Service } from "../types/Service";
import Handler, {HandlerBase} from "./handler";

import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";

import LINEAPI from "../api/LINE";
import SLACKAPI from "../api/Slack";

/**
 * LineHandler handles webhooks from LINE,
 * distributing the entry to other services
 * according to given "Rule".
 */
export default class LineHandler extends HandlerBase implements Handler {

  private transformer: Transform;
  private LINEAPI: LINEAPI;
  private SLACKAPI: SLACKAPI;

  constructor(rule: Rule, vars: IVariables) {
    super(rule, vars);
    this.transformer = rule.transform ? rule.transform : new LineToSlack();
    this.LINEAPI = new LINEAPI(vars.LINE_CHANNEL_ACCESS_TOKEN);
    this.SLACKAPI = new SLACKAPI(vars.SLACK_APP_BOT_ACCESS_TOKEN);
    // TODO: Dispatch commit destinations by rule.destination
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

  /**
   * The main interface to be hit by Webhook.
   * @param req express.Request
   */
  public handle(req: express.Request): Promise<any[]> {
    if (req.body.events.length === 0) {
      return Promise.reject([]);
    }
    return Promise.all(this.handleAllEvents(req));
  }

  /**
   * handleAllEvents handles all the events included inside the request.
   * @param req express.Request
   */
  private handleAllEvents(req: express.Request): Array<Promise<any>> {
    return req.body.events.map(event => this.__handle({payload: event, req}));
  }

  /**
   * __handle handles each event as an Entry.
   * @param entry Entry
   */
  private __handle(entry: Entry): Promise<any> {
    return this.populate(entry)
    .then(this.filter.bind(this))
    .then(this.transform.bind(this))
    .then(this.commit.bind(this));
  }

  /**
   * populate user profile and group infromation to Event.
   * @param entry Entry
   */
  private populate(entry: Entry): Promise<Entry> {
    const payload = entry.payload as LINE.Event;
    return this.LINEAPI.getSourceProfile(payload.source).then(user => {
      payload.user = user;
      entry.payload = payload;
      return Promise.resolve(entry);
    });
  }

  /**
   * filter if the group name is not the target specified in Rule.
   * @param entry Entry
   * TODO: The name "skip" is a kind of negative flag, it's anti-pattern of software.
   */
  private filter(entry: Entry): Promise<Entry> {
    /* tslint:disable no-console */
    console.log("[LINE][0000]", JSON.stringify(entry.payload));
    const payload = entry.payload as LINE.Event;
    // entry.skip = true;
    // if (this.rule.source.group instanceof RegExp) {
    //   entry.skip = !this.rule.source.group.test(payload.source.groupId);
    // } else if (typeof this.rule.source.group === "string") {
    //   entry.skip = (this.rule.source.group !== payload.source.groupId);
    // }
    return Promise.resolve(entry);
  }

  private transform(entry: Entry): Promise<Entry> {
    if (entry.skip) {
      return Promise.resolve(entry);
    }
    return this.transformer.json(entry.payload).then(transformed => {
      entry.transformed = transformed;
      return Promise.resolve(entry);
    });
  }

  /**
   * Finally hit external API to send message!
   * @param entry Entry
   */
  private commit(entry: Entry): Promise<Entry[]> {
    if (entry.skip) {
      return Promise.resolve([entry]);
    }
    const message = entry.transformed as Slack.Event;
    return Promise.all(
      (this.rule.destination.channels || []).map(channel => {
        const m = Object.assign(message, {channel});
        return this.SLACKAPI.postMessage(m);
      }),
    );
  }
}
