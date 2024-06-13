import { useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import {
  UpdateItemInput,
  CreateItemMutation,
  CreateItemInput,
  UpdateItemMutation,
} from "../../gql/graphql";
import { createItemMutation } from "../../queries/createItemMutation";
import { updateItemMutation } from "../../queries/updateItemMutation";
import { client } from "../../services/GraphQLClient";
import { withError } from "../../utils/withError";
import ItemForm, { ItemFormProps, SubmitFormValues } from "../ItemForm";

export const SaveItem = ({
  itemId,
  formProps,
}: {
  itemId?: string;
  formProps: Omit<ItemFormProps, "onSubmit">;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateItem = useMutation<UpdateItemMutation, Error, UpdateItemInput>(
    async (updateItemInput) => {
      try {
        return await client.request({
          document: updateItemMutation,
          variables: { input: updateItemInput },
        });
      } catch (err) {
        return withError(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        if (itemId) {
          queryClient.invalidateQueries(["items", itemId]);
        }
      },
    }
  );

  const createItem = useMutation<CreateItemMutation, Error, CreateItemInput>(
    async (createItemInput) => {
      try {
        return await client.request({
          document: createItemMutation,
          variables: { input: createItemInput },
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
    async (formValues: SubmitFormValues) => {
      const { category, name, price, url, image_url } = formValues;
      const categoryId = category.id;

      try {
        if (itemId) {
          await updateItem.mutateAsync({
            name,
            price,
            url,
            image_url,
            categoryId,
            id: Number(itemId),
          });
          navigate(`/items/${itemId}`);
        } else {
          const res = await createItem.mutateAsync({
            name,
            price,
            url,
            image_url,
            categoryId,
          });
          if (res.createItem?.id) {
            navigate(`/items/${res.createItem.id}`);
          } else {
            navigate(`/`);
          }
        }
      } catch (err) {
        Sentry.captureException(err, {
          level: "error",
          tags: {
            type: "Create Item",
          },
          extra: formValues,
        });
      }
    },
    [itemId]
  );

  return (
    <ItemForm
      {...formProps}
      onSubmit={onSubmit}
      error={createItem.error || updateItem.error}
    />
  );
};
