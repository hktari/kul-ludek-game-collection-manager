import BoardGameGeekErrorParser from "./boardGameGeekErrorParser";

describe("BoardGameGeekErrorParser", () => {
  it("adding two error objects should join messages with ", () => {
    const parser = new BoardGameGeekErrorParser();
    const firstErrors = {
      'minAge': "first error",
    };
    const secondErrors = {
      'minAge': "second error",
    };

    parser.add(firstErrors);
    parser.add(secondErrors);

    const errorMsg = parser.parse();

    expect(errorMsg).toBe("[minAge]: first error, second error");
  });
});
