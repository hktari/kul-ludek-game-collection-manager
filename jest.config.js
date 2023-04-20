module.exports = {
    roots: ["./src"],
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testTimeout: 15000,
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
      "^@src/(.*)$": "<rootDir>/src/$1",
    }
  }