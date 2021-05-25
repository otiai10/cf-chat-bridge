import * as express from "express";
import {createHandler, Handler} from "./handler";
import BuiltinHandler from "./handler/Builtin";
import Rule from "./types/Rule";
import Secrets from "./types/Secrets";
import Verifier from "./verifier";
import { Log, Logging } from "@google-cloud/logging";

export interface BridgeConfig {
  secrets: Secrets;
  rules: Rule[];
}

export class Bridge {

  public rules: Rule[];
  private secrets: Secrets;
  private verifier: Verifier;
  private handlers: Handler[] = [];
  private lg: Log;

  constructor({ secrets, rules }: BridgeConfig) {
    this.secrets = secrets;
    this.rules = rules;
    this.verifier = new Verifier(secrets);
    this.lg = (new Logging()).log('cf-chat-bridge');
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
      const results = await Promise.all(this.handlers.filter(h => h.match(req)).map(h => {
        this.log({
          message: `MATCH: ${(h as any).constructor.name}`,
          handler: (h as any).constructor.name,
          body: req.body,
        }, { component: 'bridge' }, 'DEBUG');
        return h.handle(req);
      }));
      const result = results.length === 1 ? results[0] : results;
      this.log({
        message: `RESULT`,
        result,
        query: req.query,
        body: req.body,
      }, { component: 'bridge' }, 'DEBUG');
      res.status(200).json(results);
    } catch (err) {
      this.log({
        message: err.message,
        stack: err.stack,
        code: err.code,
      }, { component: 'bridge' }, 'ERROR');
      res.status(500).json(err);
    }
  }

  private async log(payload: any, labels: { [key: string]: string } = {}, severity = 'INFO'): Promise<any> {
    const entry = this.lg.entry({ labels, severity }, payload);
    return await this.lg.write(entry);
  }
}
