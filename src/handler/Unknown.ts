import Handler from "./handler";

export default class UnknownHandler implements Handler {
    match(/* req: express.Request */): boolean {
        return false;
    }
    handle(/* req: express.Request */): Promise<any[]> {
        return Promise.resolve([]);
    }
}
