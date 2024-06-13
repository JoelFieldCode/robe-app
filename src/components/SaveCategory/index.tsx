import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateCategoryMutation,
  CreateCategoryInput,
  UpdateCategoryInput,
  UpdateCategoryMutation,
} from "../../gql/graphql";
import { createCategoryMutation } from "../../queries/createCategory";
import { updateCategoryMutation } from "../../queries/updateCategory";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";
import { CategoryForm, CategoryFormProps, FormValues } from "../CategoryForm";

export const SaveCategory = ({
  categoryId,
  formProps,
}: {
  categoryId?: string;
  formProps: Omit<CategoryFormProps, "onSubmit">;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const createCategory = useMutation<
    CreateCategoryMutation,
    Error,
    CreateCategoryInput
  >(
    async (createCategoryInput) => {
      try {
        return await client.request({
          document: createCategoryMutation,
          variables: { input: createCategoryInput },
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

  const onSubmit = useCallback(
    async ({ name }: FormValues) => {
      if (categoryId) {
        await updateCategory.mutateAsync({
          name,
          id: Number(categoryId),
        });
        navigate(`/categories/${categoryId}`);
      } else {
        const res = await createCategory.mutateAsync({
          name,
        });
        if (res.createCategory?.id) {
          navigate(`/categories/${res.createCategory.id}`);
        } else {
          navigate(`/`);
        }
      }
    },
    [categoryId]
  );

  return <CategoryForm {...formProps} onSubmit={onSubmit} />;
};
