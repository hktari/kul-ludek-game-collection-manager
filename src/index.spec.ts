import * as index from "./index";

describe("index.ts", () => {
  it("should be defined", () => {
    expect(index).toBeDefined();
  });
  it("should variable should equal 2", () => {
    const t: number = 2;
    expect(t).toBe(2);
  });
});
