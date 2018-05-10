import * as express from "express";
import { IVariables } from ".";
import Rule from "./rule";

export default interface Handler {
  match(req: express.Request): boolean;
  handle(req: express.Request): Promise<any>;
}

export class HandlerBase {

  protected rule: Rule;
  private vars: IVariables;

  constructor(rule: Rule, vars: any) {
    this.rule = rule;
    this.vars = vars;
  }

  public match(req: express.Request): boolean {
    return false;
  }

  public handle(req: express.Request): Promise<any> {
    return Promise.resolve({});
  }

}
