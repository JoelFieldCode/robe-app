import { graphql } from "../gql/gql";

export const createItemMutation = graphql(/* GraphQL */ `
  mutation createItem($input: CreateItemInput) {
    createItem(input: $input) {
      id
    }
  }
`);
