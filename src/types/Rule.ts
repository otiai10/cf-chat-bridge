// import * as express from "express";
import Transform from "../transform";
// import * as LINE from "./LINE";
import {Service} from "./Service";

export interface Source {
  service: Service;
  group?: RegExp|string;
  channel?: RegExp|string;
  includeThread?: boolean;
}

export interface Destination {
  service: Service;
  channels?: string[];
  to?: string[];
}

export default interface Rule {
  source: Source;
  destination: Destination;
  transforms?: Transform[];
  pipe?: Source[];
}
