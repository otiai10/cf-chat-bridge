import * as express from "express";
import {createHandler, Handler} from "./handler";
import BuiltinHandler from "./handler/Builtin";
import Rule from "./types/Rule";
import Verifier from "./verifier";

export interface AppOptions {
  vars?: Variables;
}

import Variables from "./types/Vars";

export function init(options: AppOptions = {}): App {
  return new App(options);
}

export default class App {

  private vars: Variables = {};
  private handlers: Handler[] = [];
  private verifier: Verifier;

  constructor(options: AppOptions) {
    this.vars = options.vars || {};
    this.verifier = new Verifier(this.vars);
  }

  public webhook(rules): (req: express.Request, res: express.Response) => void {
    this.handlers = this.createHandlers(rules);
    return this.dispatch.bind(this);
  }

  private dispatch(req, res): void {
    if (!this.verifier.verify(req)) {
      return res.status(400).end();
    }
    Promise.all(
      this.handlers.filter(h => h.match(req)).map(h => h.handle(req)),
    ).then(results => {
      /* tslint:disable no-console */
      res.status(200).json(results.length === 1 ? results[0] : results);
    }).catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  }

  private createHandlers(rules: Rule[] = []): Handler[] {
    return [
      ...rules.map<Handler[]>(rule => {
        return createHandler(rule, this.vars);
      }).reduce((all: Handler[], part: Handler[]) => all.concat(part), []),
      new BuiltinHandler({}, this.vars),
    ];
  }

}
