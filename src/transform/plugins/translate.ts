import * as Google from "../../api/Google";
import * as LINE from "../../types/LINE";
import * as Slack from "../../types/Slack";

export default class Translate {

  public from: string;
  public to: string;
  public google: Google.API;

  constructor(from: string, to: string, GoogleAPIKey: string) {
    this.from = from;
    this.to = to;
    this.google = new Google.API(GoogleAPIKey);
  }

  public json(payload: any): Promise<any> {
    const text = this.getOriginalText(payload);
    return this.google.translate(text, this.from, this.to).then(res => {
      try { res = JSON.parse(res); } catch (e) { return Promise.resolve(payload); }
      if (!res.data || !res.data.translations || res.data.translations.length === 0) {
        payload.text += " (not translated)";
        return Promise.resolve(payload);
      }
      payload.text = res.data.translations[0].translatedText;
      return Promise.resolve(payload);
    });
  }
  private getOriginalText(payload: LINE.Message | Slack.Event): string {
    return payload.text;
  }
}
