import * as express from "express";
import { IVariables } from "..";
import Rule from "../types/Rule";
import { Service } from "../types/Service";
import Handler from "./handler";
import LineHandler from "./LINE";

export function createHandler(rule: Rule, vars: IVariables): Handler {
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
    default:
      return new LineHandler(rule, vars);
  }
}
