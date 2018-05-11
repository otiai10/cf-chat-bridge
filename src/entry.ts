import * as express from "express";
import * as LINE from "./types/LINE";

export default interface Entry {
    payload: LINE.Event;
    req: express.Request;
    skip?: boolean;
}
