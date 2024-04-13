import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: './src/schema/schema.graphql',
    documents: ['src/**/*.tsx', '!src/gql/**/*'],
    generates: {
        './src/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;