import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryForm, FormValues } from "../../components/CategoryForm";
import { CreateCategoryMutation, CreateCategoryInput } from "../../gql/graphql";
import { createCategoryMutation } from "../../queries/createCategory";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";

export const CreateCategory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const onSubmit = useCallback(async ({ name }: FormValues) => {
    const res = await createCategory.mutateAsync({
      name,
    });

    if (res.createCategory?.id) {
      navigate(`/categories/${res.createCategory.id}`);
    }
  }, []);

  return (
    <CategoryForm
      name={null}
      onSubmit={onSubmit}
      submitText="Create Category"
    />
  );
};
