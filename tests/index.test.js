import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { greet, add } from "../src/index.js";

describe("greet", () => {
  it("returns greeting for valid name", () => {
    assert.equal(greet("World"), "Hello, World! — team nurlan");
  });

  it("throws for empty name", () => {
    assert.throws(() => greet(""), /name must be a non-empty string/);
  });
});

describe("add", () => {
  it("sums two numbers", () => {
    assert.equal(add(2, 3), 5);
  });
});
