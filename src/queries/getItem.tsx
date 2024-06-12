import { graphql } from "../gql/gql";

export const getItemDocument = graphql(/* GraphQL */ `
  query getItem($itemId: Int!) {
    getItem(itemId: $itemId) {
      name
      id
      image_url
      url
      price
      categoryId
    }
  }
`);
