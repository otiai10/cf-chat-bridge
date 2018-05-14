import * as express from "express";
import * as LINE from "./LINE";
import {Service} from "./Service";

export interface Source {
  service: Service;
  group?: RegExp|string;
}

export interface Destination {
  service: Service;
  channels?: string[];
}

export interface Transform {
  json: (payload: LINE.Event|any) => object;
}

export default interface Rule {
  source: Source;
  destination: Destination;
  transform?: Transform;
}
