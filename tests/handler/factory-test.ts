/* tslint:disable no-var-requires */
const vars = require("../data/example-vars.json");

import {createHandler, Handler, LineHandler, SlackHandler} from "../../src/handler";

describe("createHandler", () => {
  it("should be a function", () => {
    const rules = require("../data/example-rules");
    expect(typeof createHandler).toBe("function");
    const h = createHandler(rules[0], vars);
    expect(h).toBeInstanceOf(Array);
    expect(h).toHaveLength(1);
    expect(h[0]).toBeInstanceOf(LineHandler);
  });
  it("should create 2 handlers if `pipe` in the rule is given", () => {
    const rules = require("../data/pipe-rules");
    const h = createHandler(rules[0], vars);
    expect(h).toHaveLength(2);
    expect(h[0]).toBeInstanceOf(LineHandler);
    expect(h[1]).toBeInstanceOf(SlackHandler);
  });
});
