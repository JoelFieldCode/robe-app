import { graphql } from "../gql/gql";

export const getCategoryDocument = graphql(/* GraphQL */ `
  query getCategory($categoryId: Int!) {
    getCategory(categoryId: $categoryId) {
      id
      name
      image_url
      itemCount
      items {
        id
        name
        image_url
        price
        url
        categoryId
      }
    }
  }
`);
