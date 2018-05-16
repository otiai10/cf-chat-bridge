import * as request from "request-promise";

export default class API {
  private static baseURL: string = "https://slack.com/api";
  private accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  /**
   * https://api.slack.com/methods/chat.postMessage
   */
  public postMessage(): Promise<any> {
    const uri = `${API.baseURL}/chat.postMessage`;
    return request.post(uri, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      json: {
        channel: "bot-dev-3x",
        text: "This is test",
      },
    });
  }
}
