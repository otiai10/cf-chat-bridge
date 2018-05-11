import * as express from "express";
import { IVariables } from ".";
import Handler from "./handler";
import LineHandler from "./handler_line";
import Rule from "./rule";
import { Service } from "./service";

export function createHandler(rule: Rule, vars: IVariables): Handler {
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
    default:
      return new LineHandler(rule, vars);
  }
}
