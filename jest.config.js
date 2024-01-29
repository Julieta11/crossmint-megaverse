module.exports = {
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "test/tsconfig.json" }],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>"],
};
