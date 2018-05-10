/// <reference types="express" />
import * as express from "express";
import Handler, { HandlerBase } from "./handler";
export default class LineHandler extends HandlerBase implements Handler {
    verify(req: express.Request): boolean;
    populate(req: express.Request): express.Request;
}
