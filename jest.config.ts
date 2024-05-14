import type { InitialOptionsTsJest } from 'ts-jest';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  globals: {
	  'ts-jest': {
		  tsconfig: {
			  "jsx": "react-jsxdev",
			  allowJs: true,
			  allowSyntheticDefaultImports: true
		  }
	  }
  },
  testEnvironment: 'jsdom',
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  // roots: ['<rootDir>/client'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
}


export default config;
