import { graphql } from "../gql/gql";

export const updateItemMutation = graphql(/* GraphQL */ `
  mutation updateItem($input: UpdateItemInput!) {
    updateItem(input: $input) {
      id
    }
  }
`);
