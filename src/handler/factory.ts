import * as express from "express";
import { IVariables } from "..";
import Rule from "../types/Rule";
import { Service } from "../types/Service";
import Handler from "./handler";
import LineHandler from "./LINE";
import SlackHandler from "./Slack";
import UnknownHandler from "./Unknown";

export function createHandler(rule: Rule, vars: IVariables): Handler {
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
      return new LineHandler(rule, vars);
    case Service.SLACK:
      return new SlackHandler(rule, vars);
    default:
      return new UnknownHandler();
  }
}
