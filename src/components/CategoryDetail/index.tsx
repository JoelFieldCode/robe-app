import React from "react";
import { useQuery } from "@tanstack/react-query";
import ItemCard from "../ItemCard";
import { client } from "../../services/GraphQLClient";
import { graphql } from "../../gql/gql";
import { formatItemCount } from "../../utils/formatItemCount";
import { Button } from "../../@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

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

const CategoryDetail = ({
  closeCategory,
  categoryId,
}: {
  categoryId: number;
  closeCategory: () => void;
}) => {
  const { isLoading, data } = useQuery(["categories", categoryId], async () =>
    client.request({
      document: getCategoryDocument,
      variables: { categoryId },
    })
  );

  if (isLoading) {
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>;
  }

  if (!data?.getCategory) {
    return <>Category not found</>;
  }

  const category = data.getCategory;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Button onClick={() => closeCategory()} variant="default">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
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
