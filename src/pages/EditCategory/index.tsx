import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm, FormValues } from "../../components/CategoryForm";
import { FullScreenLoader } from "../../components/FullScreenLoader/FullScreenLoader";
import { UpdateCategoryInput, UpdateCategoryMutation } from "../../gql/graphql";
import { getCategoryDocument } from "../../queries/getCategory";
import { updateCategoryMutation } from "../../queries/updateCategory";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";

export const EditCategory = () => {
  const { categoryId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, isFetching, isError, data } = useQuery(
    ["categories", categoryId],
    async () =>
      client.request({
        document: getCategoryDocument,
        variables: { categoryId: categoryId ? Number(categoryId) : 0 },
      }),
    { enabled: !!categoryId, retry: false }
  );

  const updateCategory = useMutation<
    UpdateCategoryMutation,
    Error,
    UpdateCategoryInput
  >(
    async (updateCategoryInput) => {
      try {
        return await client.request({
          document: updateCategoryMutation,
          variables: { input: updateCategoryInput },
        });
      } catch (err) {
        return withError(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  const onSubmit = useCallback(async ({ name }: FormValues) => {
    if (!categoryId) {
      return;
    }
    const res = await updateCategory.mutateAsync({
      name,
      id: Number(categoryId),
    });

    if (res.updateCategory?.id) {
      navigate(`/categories/${categoryId}`);
    } else {
      return;
    }
  }, []);

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
    <CategoryForm
      name={category.name}
      onSubmit={onSubmit}
      submitText="Update Category"
    />
  );
};
