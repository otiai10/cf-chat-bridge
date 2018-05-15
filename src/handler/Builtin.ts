import * as express from "express";
import LINEAPI from "../api/LINE";
import Entry from "../types/Entry";
import * as LINE from "../types/LINE";
import {Service} from "../types/Service";
import Handler, {HandlerBase} from "./handler";

export default class BuiltinHandler extends HandlerBase implements Handler {
  private LINEAPI: LINEAPI;
  constructor(rule, vars) {
    super(rule, vars);
    this.LINEAPI = new LINEAPI(this.vars.LINE_CHANNEL_ACCESS_TOKEN);
  }
  public match(req: express.Request): boolean {
    if (req.query.source === Service.LINE) {
      return true;
    }
    return false;
  }
  public handle(req: express.Request): Promise<any> {
    if (req.query.source === Service.LINE) {
      return this.handleLINE(req);
    }
    return Promise.resolve({});
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

}
