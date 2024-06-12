import { graphql } from "../gql/gql";

export const updateCategoryMutation = graphql(/* GraphQL */ `
  mutation updateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
    }
  }
`);
