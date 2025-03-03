import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { FullScreenLoader } from "../../components/FullScreenLoader/FullScreenLoader";
import { SaveCategory } from "../../components/SaveCategory";
import { getCategoryDocument } from "../../queries/getCategory";
import { client } from "../../services/GraphQLClient";

export const EditCategory = () => {
  const { categoryId } = useParams();
  const { isLoading, isFetching, isError, data } = useQuery(
    ["categories", categoryId],
    async () =>
      client.request({
        document: getCategoryDocument,
        variables: { categoryId: categoryId ? Number(categoryId) : 0 },
      }),
    { enabled: !!categoryId, retry: false }
  );

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return <>Category not found </>;
  }

  const category = data?.getCategory;

  if (!category) {
    return null;
  }

  return (
    <SaveCategory
      categoryId={categoryId}
      formProps={{ name: category.name, submitText: "Update Category" }}
    />
  );
};
