module.exports = {
  // Use ts-jest ESM preset because the package uses ESM ("type": "module")
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  // Treat TS as ESM so native import/export syntax is supported in tests
  extensionsToTreatAsEsm: [".ts"],
  // Allow importing TS files with .js extension in paths (NodeNext style)
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.(js|jsx)$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        diagnostics: false,
        tsconfig: {
          module: "NodeNext",
          moduleResolution: "NodeNext",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          verbatimModuleSyntax: true,
          isolatedModules: true,
          target: "ES2022",
        },
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
