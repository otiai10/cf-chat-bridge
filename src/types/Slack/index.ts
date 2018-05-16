
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
  type?: EventType;
  user?: string | object;
  text?: string;
  ts?: number;
  channel: string;
  event_ts?: number;
  channel_type?: ChannelType;

  // From integration
  bot_id?: string;
  subtype?: Subtype;

  // For chat.postMessage
  attachments?: Attachment[];
  icon_emoji?: string;
  icon_url?: string;
  link_names?: boolean;
  username?: string;
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

/**
 * https://api.slack.com/docs/message-attachments
 */
export interface Attachment {
  title?: string;
  image_url?: string;
  text?: string;
}

/**
 * https://api.slack.com/events/message
 */
export enum Subtype {
  BOTMESSAGE = "bot_message",
}
