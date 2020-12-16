import Handler from "./handler";

export default class UnknownHandler implements Handler {
  public match(/* req: express.Request */): boolean {
    return false;
  }
  public handle(/* req: express.Request */): Promise<any[]> {
    return Promise.resolve([]);
  }
}
