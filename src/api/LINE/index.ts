import * as request from "request-promise";
import * as types from "../../types/LINE";

export default class API {

  private static baseURL = "https://api.line.me";
  private token: string;

  constructor(accessToken: string) {
    this.token = accessToken;
  }

  public getSourceProfile(source: types.EventSource): Promise<types.User> {
    if (!source.userId) {
      return Promise.reject({msg: "No userId found on this source"});
    }
    const uri = this.createProfileURI(source);

    return request.get(uri, this.auth()).then<types.User>((value: any) => {
      return Promise.resolve(JSON.parse(value));
    });
  }

  public pushMessage(to: string, message: types.Message): Promise<any> {
    const uri = `${API.baseURL}/v2/bot/message/push`;
    return request.post(uri, this.auth({
      json: {
        messages: [message],
        to,
      },
    }));
  }

  private createProfileURI(source: types.EventSource): string {
    switch (source.type) {
    case types.EventSourceType.GROUP:
      return `${API.baseURL}/v2/bot/group/${source.groupId}/member/${source.userId}`;
    case types.EventSourceType.ROOM:
      return `${API.baseURL}/v2/bot/room/${source.roomId}/member/${source.userId}`;
    default:
      return `${API.baseURL}/v2/bot/profile/${source.userId}`;
    }
  }
  private auth(options = {} as request.Options): request.Options {
    if (!options.headers) {
      options.headers = {};
    }
    /* tslint:disable no-string-literal */
    options.headers["Authorization"] = `Bearer ${this.token}`;
    return options;
  }
}
