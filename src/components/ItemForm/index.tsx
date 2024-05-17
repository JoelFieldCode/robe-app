import React, { FC, ReactNode, useCallback, useRef } from "react";
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
import { Card } from "../../@/components/ui/card";
import { useShareImageStore } from "../../store/shareImageStore";

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
  url: Yup.string().url().required(),
  name: Yup.string().required("Name is required"),
  image: Yup.mixed().optional(),
});

export const FieldContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">{children}</div>
);

type ItemSchema = typeof itemSchema;

export type FormValues = Yup.InferType<ItemSchema>;
export type CategoryOptionType = FormValues["category"];

const createItemMutation = graphql(/* GraphQL */ `
  mutation createItem($input: CreateItemInput) {
    createItem(input: $input) {
      id
    }
  }
`);

const uploadImageMutation = graphql(/* GraphQL */ `
  mutation uploadImage($image: File!) {
    uploadImage(image: $image)
  }
`);

const createCategoryMutation = graphql(/* GraphQL */ `
  mutation createCategory($input: CreateCategoryInput) {
    createCategory(input: $input) {
      id
    }
  }
`);

export type ItemFormProps = {
  defaultUrl: string | null;
  defaultName: string | null;
  defaultImage: File | null;
};

const ItemForm: FC<ItemFormProps> = ({
  defaultName,
  defaultUrl,
  defaultImage,
}) => {
  const { reset } = useShareImageStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: yupResolver(itemSchema),
    defaultValues: {
      url: defaultUrl ?? "",
      name: defaultName ?? "",
      image: defaultImage,
    },
    mode: "onSubmit",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  // TODO type the error response..
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

  // TODO type the error response..
  const createItem = useMutation(
    async (createItemInput: CreateItemInput) => {
      try {
        return await client.request({
          document: createItemMutation,
          variables: { input: createItemInput },
        });
      } catch (err: any) {
        // this could be a re-usable Higher order function
        if (err.response?.errors?.[0].message) {
          throw new Error(err.response.errors[0].message);
        } else {
          throw err;
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );

  // TODO move this up so ItemForm can be used for creating or updating a category?
  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      // does this throw if there's an error?
      let image_url = values.image
        ? // TODO catch error
          await client
            .request({
              document: uploadImageMutation,
              variables: { image: values.image },
            })
            .then((res) => res.uploadImage)
        : null;

      let categoryId = values.category.id
        ? Number(values.category.id)
        : undefined;
      const { name, url, price, category } = values;

      if (!categoryId) {
        try {
          const res = await createCategory.mutateAsync({
            name: category.name,
            image_url,
          });

          if (!res.createCategory) {
            return;
          }

          categoryId = res.createCategory.id;
        } catch (err) {
          return;
        }
      }

      try {
        await createItem.mutateAsync({
          categoryId,
          name,
          url,
          price,
          image_url,
        });

        reset();
        navigate(`/categories/${categoryId}`);
      } catch (err) {
        return;
      }
    },
    [navigate, queryClient, createCategory, createItem]
  );

  const hasError = createCategory.isError || createItem.isError;
  // TODO type the error properly..
  const error =
    (createCategory.error as Error | null) ||
    (createItem.error as Error | null);

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  const { isSubmitting } = form.formState;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FieldContainer>
            <Controller
              name="image"
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => {
                return (
                  <>
                    {value && (
                      <Card className="mb-1">
                        <img
                          className="w-full object-contain max-h-96"
                          src={URL.createObjectURL(value)}
                        />
                      </Card>
                    )}
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {value ? "Change Image" : "Select Image"}
                    </Button>
                    <Input
                      {...fieldProps}
                      className="hidden"
                      ref={fileInputRef}
                      placeholder="Picture"
                      type="file"
                      onChange={(event) => {
                        onChange(event.target.files?.[0]);
                      }}
                      accept="image/png, image/jpeg, image/webp image/avif"
                    />

                    <ErrorMessage
                      name="image"
                      errors={formState.errors}
                      render={({ message }) => (
                        <p className="text-red-500">{message}</p>
                      )}
                    />
                  </>
                );
              }}
            />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="price">Price</Label>
            <Input type="number" {...register("price")} step=".01" />
            <ErrorMessage
              name="price"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </FieldContainer>
          <FieldContainer>
            <Label htmlFor="name">Name</Label>
            <Input type="text" {...register("name")} />
            <ErrorMessage
              name="name"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </FieldContainer>

          <FieldContainer>
            <Label htmlFor="url">URL</Label>
            <Input type="text" {...register("url")} />
            <ErrorMessage
              name="url"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </FieldContainer>

          <FieldContainer>
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
          </FieldContainer>

          <div>
            <Button disabled={isSubmitting} variant="default" type="submit">
              Add to Robe
            </Button>
          </div>

          {hasError && (
            <div>
              <Alert variant="destructive">
                <AlertTitle>
                  {error ? error.message : "Error adding item"}
                </AlertTitle>
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
