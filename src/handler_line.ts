import express from "express";

import Handler, {HandlerBase} from "./handler";

export default class LineHandler extends HandlerBase implements Handler {
  public verify(req: express.Request): boolean {
    return true;
  }
  public populate(req: express.Request): express.Request {
    return req;
  }
}
