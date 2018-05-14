import * as express from "express";
import Handler, { HandlerBase } from "./handler";

export default class UnknownHandler extends HandlerBase implements Handler {
  public match(req: express.Request): boolean {
    return false;
  }
  public handler(req: express.Request): Promise<any[]> {
    return Promise.resolve([]);
  }
}
