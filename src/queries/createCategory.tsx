import { graphql } from "../gql/gql";

export const createCategoryMutation = graphql(/* GraphQL */ `
  mutation createCategory($input: CreateCategoryInput) {
    createCategory(input: $input) {
      id
      name
    }
  }
`);
