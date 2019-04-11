module.exports = {
  modulePaths: [
    '<rootDir>/src/'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/emptyMock.js'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,vue}',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/__tests__/'
  ],
  coverageReporters: [
    'text'
  ]
};
