import * as express from "express";
import LINEAPI from "../api/LINE";
import Entry from "../types/Entry";
import {Service} from "../types/Service";
import * as LINE from "../types/LINE";
import * as Slack from "../types/Slack";
import Secrets from "../types/Secrets";
import Handler from "./handler";
import Rule from "../types/Rule";

/**
 * BuiltinHandler handles ANY webhook requests which are required by services.
 * For example:
 *     - Checking LINE Chat ID, because LINE can't provide a way to get Group Name by ID
 *     - Verify Slack app Event API endpoint, because Slack sends "challenge" when registering subscribe endpoint.
 * These webhooks should be handled no matter what Rules user defined, therefore
 * this handler handles these webhooks.
 */
export default class BuiltinHandler implements Handler {
  private LINEAPI: LINEAPI;
  constructor(private rule: Rule, private secrets: Secrets) {
    this.LINEAPI = new LINEAPI(this.secrets.LINE_CHANNEL_ACCESS_TOKEN);
  }
  public match(req: express.Request): boolean {
    switch (req.query.source) {
      case Service.LINE:
        return true;
      case Service.SLACK:
        return true;
      default:
        return false;
    }
  }

  public handle(req: express.Request): Promise<Record<string, unknown>[] | Record<string, unknown>> {
    switch (req.query.source) {
      case Service.LINE:
        return this.handleLINE(req);
      case Service.SLACK:
        return this.handleSlack(req);
      default:
        return Promise.resolve({msg: "BuiltinHandler should ignore this request"});
    }
  }

  private handleLINE(req: express.Request): Promise<Record<string, unknown>[]> {
    return req.body.events.map(e => this.handleLINEEntry({req, payload: e}));
  }

  private handleLINEEntry(entry: Entry): Promise<Record<string, unknown>> {
    const ev = entry.payload as LINE.Event;
    // LINE Group ID Check
    if (ev.type === LINE.EventType.MESSAGE && ev.message.type === LINE.MessageType.TEXT) {
      if (ev.message.text.match(/^id$/i)) {
        return this.replyLINEChatID(entry);
      }
    }
    return Promise.resolve({});
  }

  private replyLINEChatID(entry: Entry): Promise<Record<string, unknown>> {
    const ev = entry.payload as LINE.Event;
    if (ev.source.groupId) {
      return this.LINEAPI.pushMessage(
        ev.source.groupId, { type: LINE.MessageType.TEXT, text: `Chat Group ID: ${ev.source.groupId}`},
      );
    }
    if (ev.source.roomId) {
      return this.LINEAPI.pushMessage(
        ev.source.roomId, { type: LINE.MessageType.TEXT, text: `Chat Room ID: ${ev.source.roomId}`},
      );
    }
    return this.LINEAPI.pushMessage(
      ev.source.userId, { type: LINE.MessageType.TEXT, text: `Chat User ID: ${ev.source.userId}` },
    );
  }

  private handleSlack(req: express.Request): Promise<Record<string, unknown>> {
    if (req.body && req.body.type === Slack.CallbackType.URLVerification) {
      return Promise.resolve({challenge: req.body.challenge});
    }
    return Promise.resolve({});
  }
}
