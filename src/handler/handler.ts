import * as express from "express";
import { IVariables } from "..";
import Rule from "../types/Rule";

export default interface Handler {
  match(req: express.Request): boolean;
  handle(req: express.Request): Promise<any>;
}

export class HandlerBase {

  protected rule: Rule;
  protected vars: IVariables;

  constructor(rule: Rule, vars: any) {
    this.rule = rule;
    this.vars = vars;
  }

  public match(req: express.Request): boolean {
    throw new Error("override me");
  }

  public handle(req: express.Request): Promise<any> {
    throw new Error("override me");
  }

}
