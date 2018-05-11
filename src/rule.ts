import * as express from "express";
import {Service} from "./service";
import * as LINE from "./types/LINE";

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
