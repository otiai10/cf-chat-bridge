import {createHandler, Handler, LineHandler} from "../../src/handler";

/* tslint:disable no-var-requires */
const rules = require("../data/example-rules");
const vars = require("../data/example-vars.json");

describe("createHandler", () => {
  it("should be a function", () => {
    expect(typeof createHandler).toBe("function");
    const h = createHandler(rules[0], vars);
    expect(h).toBeInstanceOf(Array);
    expect(h).toHaveLength(1);
    expect(h[0]).toBeInstanceOf(LineHandler);
  });
});
