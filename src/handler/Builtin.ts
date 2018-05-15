import * as express from "express";
import LINEAPI from "../api/LINE";
import SLACKAPI from "../api/Slack";
import Entry from "../types/Entry";
import * as LINE from "../types/LINE";
import {Service} from "../types/Service";
import Handler, {HandlerBase} from "./handler";

/**
 * BuiltinHandler handles ANY webhook requests which are required by services.
 * For example:
 *     - Checking LINE Chat ID, because LINE can't provide a way to get Group Name by ID
 *     - Verify Slack app Event API endpoint, because Slack sends "challenge" when registering subscribe endpoint.
 * These webhooks should be handled no matter what Rules user defined, therefore
 * this handler handles these webhooks.
 */
export default class BuiltinHandler extends HandlerBase implements Handler {
  private LINEAPI: LINEAPI;
  private SLACKAPI: SLACKAPI;
  constructor(rule, vars) {
    super(rule, vars);
    this.LINEAPI = new LINEAPI(this.vars.LINE_CHANNEL_ACCESS_TOKEN);
    this.SLACKAPI = new SLACKAPI();
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
  public handle(req: express.Request): Promise<any> {
    switch (req.query.source) {
    case Service.LINE:
      return this.handleLINE(req);
    case Service.SLACK:
      return this.handleSlack(req);
    default:
      return Promise.resolve({});
    }
  }

  private handleLINE(req: express.Request): Promise<any> {
    return Promise.all(req.body.events.map(e => this.handleLINEEntry({req, payload: e})));
  }

  private handleLINEEntry(entry: Entry): Promise<any> {
    const ev = entry.payload as LINE.Event;
    // LINE Group ID Check
    if (ev.type === LINE.EventType.MESSAGE && ev.message.type === LINE.MessageType.TEXT) {
      if (ev.message.text.match(/^id$/i)) {
        return this.replyLINEChatID(entry);
      }
    }
    return Promise.resolve({});
  }

  private replyLINEChatID(entry: Entry): Promise<any> {
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

  private handleSlack(req: express.Request): Promise<any> {
    if (req.body && req.body.type === "url_verification") {
      return Promise.resolve({challenge: req.body.challenge});
    }
    return Promise.resolve({});
  }
}
