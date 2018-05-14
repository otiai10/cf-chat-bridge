import * as express from "express";
import * as LINE from "./LINE";

export default interface Entry {
    payload: LINE.Event;
    req: express.Request;
    skip?: boolean;
}
