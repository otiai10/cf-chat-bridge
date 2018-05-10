import * as express from "express";

export default interface Entry {
    event: any;
    req: express.Request;
    skip?: boolean;
}
