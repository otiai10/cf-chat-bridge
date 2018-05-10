/// <reference types="express" />
import * as express from "express";
import Rule from "./rule";
export default interface Handler {
    match(req: express.Request): boolean;
    verify(req: express.Request): boolean;
    populate(req: express.Request): express.Request;
    handle(req: express.Request): Promise<any>;
}
export declare class HandlerBase {
    private rule;
    private vars;
    constructor(rule: Rule, vars: any);
    match(req: express.Request): boolean;
    handle(req: express.Request): Promise<any>;
}
