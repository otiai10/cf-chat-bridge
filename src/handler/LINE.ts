import * as express from "express";

import { IVariables } from "..";
import Transform from "../transform";
import LineToSlack from "../transform/LineToSlack";
import Entry from "../types/Entry";
import Rule from "../types/Rule";
import { Service } from "../types/Service";
import Handler, {HandlerBase} from "./handler";

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

  constructor(rule: Rule, vars: IVariables) {
    super(rule, vars);
    this.transformer = rule.transform ? rule.transform : new LineToSlack();
    this.LINEAPI = new LINEAPI(vars.LINE_CHANNEL_ACCESS_TOKEN);
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

    /* tslint:disable no-console */
    console.log("[DEBUG 1001]", JSON.stringify(req.body));

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
    return this.LINEAPI.getSourceProfile(entry.payload.source).then(user => {
      entry.payload.user = user;
      return Promise.resolve(entry);
    });
  }

  /**
   * filter if the group name is not the target specified in Rule.
   * @param entry Entry
   */
  private filter(entry: Entry): Promise<Entry> {
    // TODO: entry.skip = true
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
    return Promise.all(
      (this.rule.destination.channels || []).map(channel => {
        return SLACKAPI.sendIncomingWebhook(
          this.vars.SLACK_INCOMING_WEBHOOK_URL,
          Object.assign(entry.transformed, {channel}),
        );
      }),
    );
  }
}
