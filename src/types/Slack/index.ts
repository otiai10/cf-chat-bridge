
/**
 * https://api.slack.com/events-api
 */
export interface Callback {
  token?: string;
  team_id?: string;
  api_app_id?: string;
  type?: string;
  event_id?: string;
  event_time?: number;
  authed_users?: string[];
  event: Event;
}

/**
 * https://api.slack.com/events-api
 */
export enum CallbackType {
  EventCallback = "event_callback",
  URLVerification = "url_verification",
}

export interface Event {
  type: EventType;
  user?: string | object;
  text?: string;
  ts: number;
  channel: string;
  event_ts: number;
  channel_type: ChannelType;
}

export enum ChannelType {
  Channel = "channel",
  Group = "group",
}

/**
 * https://api.slack.com/events/api
 */
export enum EventType {
  MESSAGE = "message",
}
