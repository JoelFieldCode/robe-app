import { graphql } from "../gql/gql";

export const deleteItemMutation = graphql(/* GraphQL */ `
  mutation deleteItem($itemId: Int!) {
    deleteItem(itemId: $itemId)
  }
`);
