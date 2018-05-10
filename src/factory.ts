import * as express from "express";
import { IVariables } from ".";
import Handler from "./handler";
import LineHandler from "./handler_line";
import Rule from "./rule";

export function createHandler(rule: Rule, vars: IVariables): Handler {
  return new LineHandler(rule, vars);
}
