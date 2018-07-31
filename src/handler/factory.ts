import * as express from "express";
import Transform from "../transform";
import { Translate } from "../transform/plugins";
import Rule, { Destination, Source } from "../types/Rule";
import { Service } from "../types/Service";
import Variables from "../types/Vars";
import Handler from "./handler";
import LineHandler from "./LINE";
import SlackHandler from "./Slack";
import UnknownHandler from "./Unknown";

export function createHandler(rule: Rule, vars: Variables): Handler[] {
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

function handlersByPipe(rule: Rule, vars: Variables): Handler[] {
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

export function createTransforms(preset: Transform, vars: Variables, params: any[] = []): Transform[] {
  const res: Transform[] = params.map<Transform>(p => {
    if (typeof p.json === "function") {
      return p as Transform;
    }
    if (typeof p === "object" && typeof p.plugin === "string") {
      return createTransformFromPlugin(vars, p);
    }
    return null;
  }).filter(t => t != null);
  return preset === null ? res : [preset].concat(res);
}

function createTransformFromPlugin(vars: Variables, params: any): Transform {
  switch (params.plugin) {
  case "translate":
    return new Translate(params.lang.from, params.lang.to, vars.GOOGLE_API_KEY);
  default:
    return null;
  }
}
