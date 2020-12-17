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

export class Bridge {

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
      new BuiltinHandler({} as Rule, this.secrets),
    ];
  }

  private async dispatch(req, res) {
    if (!this.verifier.verify(req)) {
      res.status(400).end();
      return;
    }
    try {
      const results = await Promise.all(this.handlers.filter(h => h.match(req)).map(h => {
        console.log(JSON.stringify({
          severity: "DEBUG",
          message: `MATCH: ${(h as any).constructor.name}`,
          handler: (h as any).constructor.name,
        }));
        return h.handle(req);
      }));
      const result = results.length === 1 ? results[0] : results;
      console.log(JSON.stringify({
        severity: "DEBUG",
        message: `RESULT`,
        result,
        query: req.query,
        body: req.body,
      }));
      res.status(200).json(results);
    } catch (err) {
      console.error(JSON.stringify({
        severity: "ERROR",
        message: err.message,
        stack: err.stack,
        code: err.code,
      }));
      res.status(500).json(err);
    }
  }
}
