import * as express from "express";
import {createHandler, Handler} from "./handler";
import BuiltinHandler from "./handler/Builtin";
import Rule from "./types/Rule";
import Secrets from "./types/Secrets";
import Verifier from "./verifier";

export interface BridgeConfig {
  secrets: Secrets;
  rules: Rule[];
}

export default class Bridge {

  public rules: Rule[];
  private secrets: Secrets;
  private verifier: Verifier;
  private handlers: Handler[] = [];

  constructor({ secrets, rules }: BridgeConfig) {
    this.secrets = secrets;
    this.rules = rules;
    this.verifier = new Verifier(secrets);
  }

  public endpoint(): (req: express.Request, res: express.Response) => any {
    this.handlers = this.createHandlers(this.rules);
    return this.dispatch.bind(this);
  }

  private createHandlers(rules: Rule[] = []): Handler[] {
    return [
      ...rules.map<Handler[]>(rule => {
        return createHandler(rule, this.secrets);
      }).reduce((all: Handler[], part: Handler[]) => all.concat(part), []),
      new BuiltinHandler({}, this.secrets),
    ];
  }

  private async dispatch(req, res) {
    if (!this.verifier.verify(req)) {
      res.status(400).end();
      return;
    }
    try {
      const results = await Promise.all(this.handlers.filter(h => h.match(req)).map(h => h.handle(req)));
      res.status(200).json(results.length === 1 ? results[0] : results);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
