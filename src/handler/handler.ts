import * as express from "express";
import Transform from "../transform";
import Entry from "../types/Entry";
import Rule from "../types/Rule";
import Variables from "../types/Vars";

export default interface Handler {
  match(req: express.Request): boolean;
  handle(req: express.Request): Promise<any>;
}

/**
 * Template class defines the abstract process flow
 * and methods to be called which are required to be implemented
 * in derived classes.
 */
export class Template {

  public rule: Rule;
  public vars: Variables;
  protected transforms: Transform[] = [];

  constructor(rule: Rule, vars: any) {
    this.rule = rule;
    this.vars = vars;
  }

  /**
   * match method returns if this request should be handled by this Handler.
   * @param req Request to handle
   */
  public match(req: express.Request): boolean {
    throw new Error("match must be implemented on this Handler class");
  }

  /**
   * Entrypoint for templated methods.
   * @param req express.Request
   */
  public handle(req: express.Request): Promise<any> {
    return Promise.all(this.entries(req).map(e => {
      return Promise.resolve(e).then(entry => {
        return this.populate(entry);
      }).then(entry => {
        return this.filter(entry);
      }).then(entry => {
        return entry.skip ? Promise.resolve(entry) : this.transform(entry);
      }).then(entry => {
        return entry.skip ? Promise.resolve(entry.payload) : this.distribute(entry);
      });
    }));
  }

  /**
   * entries method split given raw request to entries
   * which this handler should handle separately.
   * @param req The raw http request
   */
  protected entries(req: express.Request): Entry[] {
    throw new Error("`entries` method is not implemented on this Handler class");
  }
  /**
   * populate methods fetch and attach additional information to the entry,
   * such as User profile from User ID, Group information from Group ID, and so on.
   * @param entry Entry to handle
   */
  protected populate(entry: Entry): Promise<Entry> {
    throw new Error("`populate` method is not implemented on this Handler class");
  }
  /**
   * filter method marks if this entry should be skipped or not.
   * If this entry is marked to be skipped, this entry is no longer handled.
   * @param entry Entry to handle
   */
  protected filter(entry: Entry): Promise<Entry> {
    throw new Error("`filter` method is not implemented on this Handler class");
  }
  /**
   * transform method transforms the payload hooked from service A
   * to a payload being posted to service B.
   * @param entry Entry to handle
   */
  protected transform(entry: Entry): Promise<Entry> {
    if (entry.skip) {
      return Promise.resolve(entry);
    }
    const entrypoint = Promise.resolve(entry.payload);
    return this.transforms.reduce((prevPromise: Promise<any>, nextTransform: Transform) => {
      return prevPromise.then(payload => nextTransform.json(payload));
    }, entrypoint).then(transformed => {
      entry.transformed = transformed;
      return Promise.resolve(entry);
    });
  }
  /**
   * distribute method finally post the transformed payload to the destination service.
   * @param entry Entry to handle
   */
  protected distribute(entry: Entry): Promise<any> {
    throw new Error("`distribute` method is not implemented on this Handler class");
  }

}
