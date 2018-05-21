import * as express from "express";
import { IVariables } from "..";
import Rule, { Destination, Source } from "../types/Rule";
import { Service } from "../types/Service";
import Handler from "./handler";
import LineHandler from "./LINE";
import SlackHandler from "./Slack";
import UnknownHandler from "./Unknown";

export function createHandler(rule: Rule, vars: IVariables): Handler[] {
  if (rule.pipe instanceof Array) {
    return handlersByPipe(rule, vars);
  }
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
      return [new LineHandler(rule, vars)];
    case Service.SLACK:
      return [new SlackHandler(rule, vars)];
    default:
      return [new UnknownHandler()];
  }
}

function handlersByPipe(rule: Rule, vars: IVariables): Handler[] {
  if (rule.pipe.length !== 2) {
    throw new Error("invalid pipe rule, length must be 2");
  }
  return [
    ...createHandler(ruleByPipe(rule.pipe[0], rule.pipe[1]), vars),
    ...createHandler(ruleByPipe(rule.pipe[1], rule.pipe[0]), vars),
  ];
}

function ruleByPipe(chan1: Source, chan2: Source): Rule {
  return {
    destination: sourceToDestination(chan2),
    source: chan1,
  };
}

function sourceToDestination(src: Source): Destination {
  switch ((src.service || "").toUpperCase()) {
    case Service.LINE:
      return {
        service: src.service,
        to: [src.group as string],
      };
    case Service.SLACK:
      return {
        channels: [src.channel as string],
        service: src.service,
      };
    default:
      return {
        service: Service.Unknown,
      };
  }
}
