/* tslint:disable no-var-requires */
import {createHandler, LineHandler} from "../../src/handler";
import LineToSlack from "../../src/transform/LineToSlack";
import Entry from "../../src/types/Entry";

const vars = require("../data/example-vars");
const messages = require("../data/messages.json");

describe("createHandler", () => {
  it("create handlers with default transforms", async () => {
    const rules = require("../data/example-rules");
    const h = createHandler(rules[0], vars)[0] as LineHandler;
    expect((h as any).transforms.length).toBe(1);
    expect((h as any).transforms[0]).toBeInstanceOf(LineToSlack);

    const exp = new Exposer(h);
    const entry = await exp.transform(messages.case_00);
    expect(entry.transformed.text).toBe("こんにちは");
  });
});

describe("When custom transforms are given", () => {
  it("transforms payload in series", async () => {
    const rule = require("../data/example-rules")[1];
    const h = createHandler(rule, vars)[0] as LineHandler;
    expect((h as any).transforms.length).toBe(2);
    expect((h as any).transforms[0]).toBeInstanceOf(LineToSlack);
    const exp = new Exposer(h);
    const entry = await exp.transform(messages.case_00);
    expect(entry.transformed.text).toBe("こんにちは!!!!!!!!!!!!!!!!!!!!");
  });
});

describe("When google translate transform is given", () => {
  it("should translate the text", async () => {
    const rule = require("../data/example-rules")[2];
    const h = createHandler(rule, vars)[0] as LineHandler;
    const exp = new Exposer(h);
    const entry = await exp.transform(messages.case_00);
    expect(entry.transformed.text).toBe("Hello");
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
