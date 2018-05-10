/// <reference types="express" />
import * as express from "express";
export interface IAppOptions {
    vars?: IVariables;
}
export interface IVariables {
    LINE_CHANNEL_SECRET?: string;
    LINE_CHANNEL_ACCESS_TOKEN?: string;
    SLACK_INCOMING_WEBHOOK_URL?: string;
}
export declare function init(options?: IAppOptions): App;
export default class App {
    private vars;
    private handlers;
    constructor(options: IAppOptions);
    webhook(rules: any): (req: express.Request, res: express.Response) => void;
    private createHandlers(rules?);
}
