import * as request from "request-promise";

export default class API {
  public static sendIncomingWebhook(uri: string, payload: any): Promise<any> {
    return request.post(uri, {json: payload});
  }
}
