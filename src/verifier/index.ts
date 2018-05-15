import * as crypto from "crypto";
import * as express from "express";
import { IVariables } from "..";
import { Service } from "../types/Service";

export default class Verifier {
    private vars: IVariables;
    constructor(vars: IVariables) {
        this.vars = vars;
    }

    public verify(req: express.Request): boolean {
        switch ((req.query.source || "").toUpperCase()) {
        case Service.LINE:
            return this.LINE(req);
        case Service.SLACK:
            return this.Slack(req);
        default:
            return false;
        }
    }

    private LINE(req: express.Request): boolean {
        let hmac: crypto.Hmac = crypto.createHmac("SHA256", this.vars.LINE_CHANNEL_SECRET);
        hmac = hmac.update(new Buffer(JSON.stringify(req.body), "utf8"));
        return req.headers["x-line-signature"] === hmac.digest("base64");
    }

    private Slack(req: express.Request): boolean {
        if (req.body.type === "url_verification") {
            return true;
        }
        return req.body.token === this.vars.SLACK_OUTGOING_WEBHOOK_TOKEN;
    }
}
