import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:7778/graphql',
  documents: [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.graphql',
    'src/**/*.gql'
  ],
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql'
      }
    },
  },
};

export default config;
