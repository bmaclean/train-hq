/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        allowJs: true,
      },
    },
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!date-fns/esm)"],
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
};
