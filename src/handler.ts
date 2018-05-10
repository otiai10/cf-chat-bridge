import express from "express";
import { IVariables } from ".";
import Rule from "./rule";

export default interface Handler {
  match(req: express.Request): boolean;
  verify(req: express.Request): boolean;
  populate(req: express.Request): express.Request;
  handle(req: express.Request): Promise<any>;
}

export class HandlerBase {

  private rule: Rule;
  private vars: IVariables;

  constructor(rule: Rule, vars: any) {
    this.rule = rule;
    this.vars = vars;
  }

  public match(req: express.Request): boolean {
    return true;
  }

  public handle(req: express.Request): Promise<any> {
    return Promise.resolve({});
  }

}
