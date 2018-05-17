
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

  // WARNING: This is populated property
  channel?: Channel;
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

export interface Channel {
  id: string;
  name: string;
  name_normalized: string;
  is_channel: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  creator: string;
  is_shared: boolean;
  is_org_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  last_read: number;
  unread_count: number;
  unread_count_display: number;
  members: string[];
  topic: {
    value: string;
    creator: string;
    last_set: number;
  };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  previous_names: string[];
}
