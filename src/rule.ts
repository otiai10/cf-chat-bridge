import * as express from "express";
import {Service} from "./service";

export interface Source {
  service: Service;
  group?: RegExp|string;
}

export interface Destination {
  service: Service;
  channels?: string[];
}

export interface Transform {
  json: (req: express.Request) => object;
}

export default interface Rule {
  source: Source;
  destination: Destination;
  transform?: Transform;
}
