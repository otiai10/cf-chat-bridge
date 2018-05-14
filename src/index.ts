import * as express from "express";
import {createHandler, Handler} from "./handler";
import Rule from "./types/Rule";
import Verifier from "./verifier";

export interface IAppOptions {
  vars?: IVariables;
}

export interface IVariables {
  LINE_CHANNEL_SECRET?: string;
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  SLACK_INCOMING_WEBHOOK_URL?: string;
}

export function init(options: IAppOptions = {}): App {
  return new App(options);
}

export default class App {

  private vars: IVariables = {};
  private handlers: Handler[] = [];
  private verifier: Verifier;

  constructor(options: IAppOptions) {
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
      res.status(200).json(results);
    }).catch(err => {
      /* tslint:disable no-console */
      console.error(err);
      res.status(500).json(err);
    });
  }

  private createHandlers(rules: Rule[] = []): Handler[] {
    return rules.map<Handler>(rule => {
      return createHandler(rule, this.vars);
    });
  }

}
