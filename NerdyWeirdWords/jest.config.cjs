/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { useESM: false }], // 👈 disattivato ESM
  },

  setupFiles: ["whatwg-fetch"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json", // usa la config specifica
    },
  },
};
