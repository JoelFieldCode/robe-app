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
    <div className="twflex twitems-center twjustify-center twh-full">
      <Loader2 className="twh-12 tww-12 twanimate-spin" />
    </div>;
  }

  if (!data?.getCategory) {
    return <>Category not found</>;
  }

  const category = data.getCategory;

  return (
    <div className="twflex twflex-col twgap-3">
      <div>
        <Button onClick={() => closeCategory()} variant="default">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <h3 className="twtext-lg twfont-bold">
        {category.name} ({formatItemCount(category.itemCount)})
      </h3>

      <div>
        {!category.items?.length ? (
          <p>You haven't added any items to this category yet.</p>
        ) : (
          <div className="twflex twflex-col twgap-4">
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
