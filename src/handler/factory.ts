import * as express from "express";
import { IVariables } from "..";
import Rule from "../rule";
import { Service } from "../service";
import Handler from "./handler";
import LineHandler from "./LINE";

export default function createHandler(rule: Rule, vars: IVariables): Handler {
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
    default:
      return new LineHandler(rule, vars);
  }
}
