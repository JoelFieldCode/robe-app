import React from "react";
import { useQuery } from "@tanstack/react-query";
import ItemCard from "../ItemCard";
import { client } from "../../services/GraphQLClient";
import { graphql } from "../../gql/gql";
import { formatItemCount } from "../../utils/formatItemCount";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useParams } from "react-router-dom";

const getCategoryDocument = graphql(/* GraphQL */ `
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

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const { isLoading, data } = useQuery(
    ["categories", categoryId],
    async () =>
      client.request({
        document: getCategoryDocument,
        variables: { categoryId: categoryId ? Number(categoryId) : 0 },
      }),
    { enabled: !!categoryId }
  );

  if (isLoading) {
    <FullScreenLoader />;
  }

  if (!data?.getCategory) {
    return <>Category not found</>;
  }

  const category = data.getCategory;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold">
        {category.name} ({formatItemCount(category.itemCount)})
      </h3>

      <div>
        {!category.items?.length ? (
          <p>You haven't added any items to this category yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {category.items?.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
