import { getContentAtUrl } from "./http.util";

describe("getContentAtUrl", () => {
  it("should return a string with length greater than 0", async () => {
    const validUrl = new URL(
      "https://boardgamegeek.com/boardgame/4324/risk-lord-rings"
    );
    const content = await getContentAtUrl(validUrl);

    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);
  });
  it("should reject for invalid url", () => {
    const invalidUrl = new URL("https://invalidUrl-rings");
    return expect(getContentAtUrl(invalidUrl)).rejects.toBeDefined();
  });
});
