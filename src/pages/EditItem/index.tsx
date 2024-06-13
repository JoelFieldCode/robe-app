import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { FullScreenLoader } from "../../components/FullScreenLoader/FullScreenLoader";
import { SaveItem } from "../../components/SaveItem";
import { getItemDocument } from "../../queries/getItem";
import { client } from "../../services/GraphQLClient";

export const EditItem = () => {
  const { itemId } = useParams();
  const { isLoading, isFetching, isError, data } = useQuery(
    ["items", itemId],
    async () =>
      client.request({
        document: getItemDocument,
        variables: { itemId: itemId ? Number(itemId) : 0 },
      }),
    { enabled: !!itemId, retry: false }
  );

  if (isLoading || isFetching) {
    <FullScreenLoader />;
  }

  if (isError) {
    return <>Item not found</>;
  }

  const item = data?.getItem;

  if (!item) {
    return null;
  }

  return (
    <SaveItem
      itemId={itemId}
      formProps={{
        defaultName: item.name,
        defaultUrl: item.url,
        defaultPrice: item.price,
        defaultCategory: {
          id: item.categoryId,
        },
        defaultImage: null,
        submitText: "Update Item",
      }}
    />
  );
};
