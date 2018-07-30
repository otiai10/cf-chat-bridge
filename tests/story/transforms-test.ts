/* tslint:disable no-var-requires */
import {createHandler, LineHandler} from "../../src/handler";
import LineToSlack from "../../src/transform/LineToSlack";
import Entry from "../../src/types/Entry";

const vars = require("../data/example-vars.json");
const messages = require("../data/messages.json");

describe("createHandler", () => {
  it("create handlers with default transforms", (ok) => {
    const rules = require("../data/example-rules");
    const h = createHandler(rules[0], vars)[0] as LineHandler;
    expect((h as any).transforms.length).toBe(1);
    expect((h as any).transforms[0]).toBeInstanceOf(LineToSlack);

    const exp = new Exposer(h);
    exp.transform(messages.case_00).then(entry => {
      expect(entry.transformed.text).toBe("こんにちは");
      ok();
    });
  });
});

class Exposer extends LineHandler {
  constructor(h: LineHandler) {
    super(h.rule, h.vars);
  }
  public transform(entry: Entry) {
    return super.transform(entry);
  }
}
