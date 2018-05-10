import express from "express";
import {createHandler} from "./factory";
import Handler from "./handler";
import Rule from "./rule";

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

  constructor(options: IAppOptions) {
    this.vars = options.vars || {};
  }

  public webhook(rules): (req: express.Request, res: express.Response) => void {
    this.handlers = this.createHandlers(rules);
    return (req, res) => {
      this.handlers.filter(h => h.match(req)).map(h => h.handle(req));
      res.status(200).end();
    };
  }

  private createHandlers(rules: Rule[] = []): Handler[] {
    return rules.map<Handler>(rule => {
      return createHandler(rule, this.vars);
    });
  }

}
