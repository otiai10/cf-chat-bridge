import * as express from "express";

/**
 * line.Event represents an event payload from LINE webhook
 * @see https://developers.line.me/en/docs/messaging-api/reference/#message-event
 */
export interface Event {

  // Original properties
  source: EventSource;
  type: EvenType;
  replyToken: string;
  timestamp: number;

  // Exists if "type" is "message"
  message?: Message;

  // Populated properties
  user?: any;

}

export interface EventSource {
  type: EventSourceType;
  userId: string;
  groupId?: string;
}

export enum EventSourceType {
  GROUP = "group",
}

export enum EvenType {
  MESSAGE = "message",
}

export enum MessageType {
  TEXT = "text",
  STICKER = "sticker",
}

export interface Message {
  id: number;
  type: MessageType;

  // Exists if type is "text"
  text?: string;

  // Exists if type is "sticker"
  stickerId?: string;
}

/**
 * User presents user structure from LINE API.
 * @see https://developers.line.me/en/docs/messaging-api/reference/#get-profile
 */
export interface User {
  displayName: string;
  userId: string;
  pictureUrl: string;
  statusMessage: string;
}
