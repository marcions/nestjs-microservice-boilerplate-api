import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from '../../tsconfig.json';
import { name } from './package.json';

export default {
  rootDir: 'src',
  displayName: name,
  name,
  preset: 'ts-jest',
  coveragePathIgnorePatterns: ['main.ts', 'swagger.ts', 'node_modules', 'module.ts', 'interface.ts'],
  setupFilesAfterEnv: ['../../../tests/common-initialization.js', '../tests/initialization.js'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../../../'
  })
};
