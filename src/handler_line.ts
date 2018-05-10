import * as express from "express";

import { IVariables } from ".";
import Entry from "./entry";
import Handler, {HandlerBase} from "./handler";
import Rule, { Transform } from "./rule";
import { Service } from "./service";
import { DefaultLineToSlackTransform } from "./transform";

export default class LineHandler extends HandlerBase implements Handler {

  private transform: Transform;
  constructor(rule: Rule, vars: IVariables) {
    super(rule, vars);
    this.transform = rule.transform ? rule.transform : new DefaultLineToSlackTransform();
    // TODO: Dispatch by rule.destination
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
    return req.body.events.map(event => this.__handle({event, req}));
  }

  /**
   * __handle handles each event as an Entry.
   * @param entry Entry
   */
  private __handle(entry: Entry): Promise<any> {
    return this.populate(entry)
    .then(this.filter.bind(this))
    .then(this.commit.bind(this));
  }

  /**
   * populate user profile and group infromation to Event.
   * @param entry Entry
   */
  private populate(entry: Entry): Promise<Entry> {
    return Promise.resolve(entry);
  }

  /**
   * filter if the group name is not the target specified in Rule.
   * @param entry Entry
   */
  private filter(entry: Entry): Promise<Entry> {
    // TODO: entry.skip = true
    return Promise.resolve(entry);
  }

  /**
   * Finally hit external API to send message!
   * @param entry Entry
   */
  private commit(entry: Entry): Promise<Entry> {
    if (entry.skip) {
      return Promise.resolve(entry);
    }
    return Promise.resolve(entry);
  }
}
