import * as express from "express";
import * as LINE from "./LINE";

export default interface Entry {
    payload: LINE.Event;
    req: express.Request;

    transformed?: any; // TODO: Type
    skip?: boolean;
}
