import * as request from "request-promise";

export default class API {
  public static sendIncomingWebhook(uri: string, payload: any): Promise<any> {
    // TODO: Return something
    return request.post(uri, {json: payload}).then(() => Promise.resolve({}));
  }
}
