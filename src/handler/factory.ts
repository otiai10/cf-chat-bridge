import Transform from "../transform";
import { Translate } from "../transform/plugins";
import Rule, { Destination, Source } from "../types/Rule";
import { Service } from "../types/Service";
import Secrets from "../types/Secrets";
import Handler from "./handler";
import LineHandler from "./LINE";
import SlackHandler from "./Slack";
import UnknownHandler from "./Unknown";

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

function ruleByPipe(chan1: Source, chan2: Source): Rule {
  return {
    destination: sourceToDestination(chan2),
    source: chan1,
  };
}

function handlersByPipe(rule: Rule, secrets: Secrets): Handler[] {
  if (rule.pipe.length !== 2) {
    throw new Error("invalid pipe rule, length must be 2");
  }
  return [
    ...createHandler(ruleByPipe(rule.pipe[0], rule.pipe[1]), secrets),
    ...createHandler(ruleByPipe(rule.pipe[1], rule.pipe[0]), secrets),
  ];
}

export function createHandler(rule: Rule, secrets: Secrets): Handler[] {
  if (rule.pipe instanceof Array) {
    return handlersByPipe(rule, secrets);
  }
  switch ((rule.source.service || "").toUpperCase()) {
    case Service.LINE:
      return [new LineHandler(rule, secrets)];
    case Service.SLACK:
      return [new SlackHandler(rule, secrets)];
    default:
      return [new UnknownHandler()];
  }
}

function createTransformFromPlugin(secrets: Secrets, params: { plugin: string; lang?: { from: string; to: string } }): Transform {
  switch (params.plugin) {
    case "translate":
      return new Translate(params.lang.from, params.lang.to, secrets.GOOGLE_API_KEY);
    default:
      return null;
  }
}

export function createTransforms(preset: Transform, secrets: Secrets, params: any[] = []): Transform[] {
  const res: Transform[] = params.map<Transform>(p => {
    if (typeof p.json === "function") {
      return p as Transform;
    }
    if (typeof p === "object" && typeof p.plugin === "string") {
      return createTransformFromPlugin(secrets, p);
    }
    return null;
  }).filter(t => t != null);
  return preset === null ? res : [preset].concat(res);
}
