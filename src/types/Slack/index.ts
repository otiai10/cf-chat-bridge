
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

  // {{{ Populated properties
  channel?: Channel;
  userprofile?: UserProfile;
  // }}}
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
  user?: string;
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

/**
 * https://api.slack.com/methods/users.profile.get
 */
export interface UserProfile {
  avatar_hash: string;
  status_text: string;
  status_emoji: string;
  real_name: string;
  display_name: string;
  real_name_normalized: string;
  display_name_normalized: string;
  // email: string;
  image_24: string;
  image_32: string;
  image_48: string;
  image_72: string;
  image_192: string;
  image_512: string;
  team: string;
}
