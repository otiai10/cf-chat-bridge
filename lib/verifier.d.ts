/// <reference types="express" />
import * as express from "express";
import { IVariables } from ".";
export default class Verifier {
    private vars;
    constructor(vars: IVariables);
    verify(req: express.Request): boolean;
    private verifyLine(req);
}
