import * as express from "express";
import {createHandler, Handler} from "./handler";
import BuiltinHandler from "./handler/Builtin";
import Rule from "./types/Rule";
import Secrets from "./types/Secrets";
import Verifier from "./verifier";
import { Logger, Severity } from "./logger";

export interface BridgeConfig {
  secrets: Secrets;
  rules: Rule[];
  logLevel?: string | string[];
}

export class Bridge {

  public rules: Rule[];
  private secrets: Secrets;
  private verifier: Verifier;
  private handlers: Handler[] = [];
  private log: Logger;

  constructor({ secrets, rules, logLevel }: BridgeConfig) {
    this.secrets = secrets;
    this.rules = rules;
    this.verifier = new Verifier(secrets);
    this.log = new Logger('cf-chat-bridge', Severity.INFO);
    if (logLevel) {
      this.log = (logLevel instanceof Array) ? new Logger('cf-chat-bridge', [
        Severity[logLevel[0].toUpperCase()],
        Severity[logLevel[logLevel.length - 1].toUpperCase()]
      ]) : new Logger('cf-chat-bridge', Severity[logLevel.toUpperCase()]);
    }
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

  private async dispatch(req: express.Request, res: express.Response) {
    if (!this.verifier.verify(req)) {
      res.status(400).end();
      return;
    }
    try {
      const handlers = this.handlers.filter(h => h.match(req));
      this.log.debug({
        message: `MATCH: ${(handlers.map(h => h.constructor.name)).join(',')}`,
        body: req.body,
      }, 'bridge');

      const results = await Promise.all(handlers.map(handler => handler.handle(req)));
      this.log.debug({ results, query: req.query, body: req.body }, 'bridge');
      res.status(200).json(results);
    } catch (err) {
      this.log.error({ message: err.message, stack: err.stack, code: err.code }, 'bridge');
      res.status(200).json(err);
    }
  }
}
