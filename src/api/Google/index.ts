import * as request from "request-promise";

// TODO: make it testable
export class API {

  private token: string;

  constructor(accessToken: string) {
    this.token = accessToken;
  }

  public translate(text: string, from: string, to: string): Promise<any> {
    const baseURL = "https://translation.googleapis.com";
    const urlPath = "/language/translate/v2";
    return request.post(baseURL + urlPath, {
      form: {
        format: "text",
        key: this.token,
        q: text,
        source: from,
        target: to,
      },
    });
  }

}
