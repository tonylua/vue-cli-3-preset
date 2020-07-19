module.exports = {
  etupFiles: ["<rootDir>/__mocks__/localStorageMock.js"],
  modulePaths: ["<rootDir>/src/components", "<rootDir>/src/utils"],

  moduleFileExtensions: ["js", "json", "jsx", "vue", "ts", "tsx"],

  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },

  transformIgnorePatterns: ["/node_modules/"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/emptyMock.js",
  },

  snapshotSerializers: ["jest-serializer-vue"],

  collectCoverage: true,

  collectCoverageFrom: [
    "<rootDir>/src/components/**/*.{ts,js,vue}",
    "<rootDir>/src/utils/**/*.{ts,js,vue}",
    "!**/*.stories.js",
    "!**/node_modules/**",
  ],

  coveragePathIgnorePatterns: ["<rootDir>/__tests__/"],

  coverageReporters: ["text"],
};
