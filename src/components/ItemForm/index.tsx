import React, { FC, useCallback } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateCategoryInput, CreateItemInput } from "../../gql/graphql";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage } from "@hookform/error-message";
import { graphql } from "../../gql/gql";
import { client } from "../../services/GraphQLClient";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
import { Button } from "../../@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../@/components/ui/alert";
import { CategorySelector } from "./CategorySelector";
import { getCategoriesQueryDocument } from "../../queries/getCategoriesQueryDocument";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { useNavigate } from "react-router-dom";

const itemSchema = Yup.object({
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number"),
  category: Yup.object({
    name: Yup.string().required(),
    id: Yup.string().optional().nullable(),
    inputValue: Yup.string().optional().nullable(),
  })
    .required("Please select a category")
    .typeError("Please select a category"),
  url: Yup.string().required(),
  name: Yup.string().required("Name is required"),
  image_url: Yup.string().optional(),
});

export type FormValues = Yup.InferType<typeof itemSchema>;
export type CategoryOptionType = FormValues["category"];

const createItemMutation = graphql(/* GraphQL */ `
  mutation createItem($input: CreateItemInput) {
    createItem(input: $input) {
      id
    }
  }
`);

const createCategoryMutation = graphql(/* GraphQL */ `
  mutation createCategory($input: CreateCategoryInput) {
    createCategory(input: $input) {
      id
    }
  }
`);

const ItemForm: FC<{
  initialUrl: string | null;
  initialName: string;
  selectedImage?: string;
}> = ({ initialName, initialUrl, selectedImage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: yupResolver(itemSchema),
    defaultValues: {
      url: initialUrl ?? "",
      name: initialName,
      image_url: selectedImage,
    },
    mode: "onChange",
  });

  const categoriesQuery = useQuery(["categories"], async () =>
    client.request(getCategoriesQueryDocument)
  );

  const categories = categoriesQuery.data?.getCategories;

  const { register, handleSubmit, control, formState } = form;

  const categoryOptions: CategoryOptionType[] =
    categories?.map((category) => ({
      name: category.name,
      id: String(category.id),
      inputValue: undefined,
    })) ?? [];

  const createCategory = useMutation(
    (createCategoryInput: CreateCategoryInput) =>
      client.request({
        document: createCategoryMutation,
        variables: { input: createCategoryInput },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  const createItem = useMutation(
    (createItemInput: CreateItemInput) =>
      client.request({
        document: createItemMutation,
        variables: { input: createItemInput },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      let categoryId = values.category.id
        ? Number(values.category.id)
        : undefined;
      const { name, url, price, image_url, category } = values;

      if (!categoryId) {
        const res = await createCategory.mutateAsync({
          name: category.name,
          image_url,
        });
        if (!res.createCategory) {
          // display to user?
          throw new Error("Error creating category");
        }
        categoryId = res.createCategory.id;
      }

      await createItem.mutateAsync({
        categoryId,
        name,
        url,
        price,
        image_url,
      });

      navigate(`/categories/${categoryId}`);
    },
    [navigate, queryClient, createCategory, createItem]
  );

  const hasError = createCategory.isError || createItem.isError;

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="price">Price</Label>
            <Input type="number" {...register("price")} />
            <ErrorMessage
              name="price"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" {...register("name")} />
            <ErrorMessage
              name="name"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </div>
          {!initialUrl && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="url">URL</Label>
              <Input type="text" {...register("url")} />
              <ErrorMessage
                name="url"
                errors={formState.errors}
                render={({ message }) => (
                  <p className="text-red-500">{message}</p>
                )}
              />
            </div>
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategorySelector
                  categories={categoryOptions}
                  value={field.value}
                  onChange={(category) => field.onChange(category)}
                />
              )}
            />
            <ErrorMessage
              name="category"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </div>

          <div>
            <Button
              disabled={formState.isSubmitting}
              variant="default"
              type="submit"
            >
              Add to Robe
            </Button>
          </div>

          {hasError && (
            <div>
              <Alert variant="destructive">
                <AlertTitle>Error adding item.</AlertTitle>
                <AlertDescription>
                  Please check your inputs and try again
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ItemForm;
