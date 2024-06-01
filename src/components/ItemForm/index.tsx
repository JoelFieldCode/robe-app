import React, { FC, useCallback, useRef } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Sentry from "@sentry/react";
import { CreateItemInput, CreateItemMutation } from "../../gql/graphql";
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
import { withError } from "../../utils/withError";
import { FieldContainer } from "../FieldContainer";

const itemSchema = Yup.object({
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number"),
  category: Yup.object({
    name: Yup.string()
      .required("Please select a category")
      .typeError("Please select a category"),
    id: Yup.number()
      .required("Please select a category")
      .typeError("Please select a category"),
  })
    .required("Please select a category")
    .typeError("Please select a category"),
  url: Yup.string().url().required("Please enter a URL"),
  name: Yup.string().required("Please enter a name"),
  image: Yup.mixed().optional(),
});

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

  const { register, handleSubmit, control, formState, setValue } = form;

  const categoryOptions: CategoryOptionType[] =
    categories?.map(({ id, name }) => ({
      id,
      name,
    })) ?? [];

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

      const categoryId = values.category.id;
      const { name, url, price } = values;

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
        Sentry.captureException(err, {
          level: "error",
          tags: {
            type: "Create Item",
          },
          extra: { name, url, price, image_url },
        });
        return;
      }
    },
    [navigate, queryClient, createItem]
  );

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
            <Label htmlFor="category">Category</Label>
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
              name="category.id"
              errors={formState.errors}
              render={({ message }) => (
                <p className="text-red-500">{message}</p>
              )}
            />
          </FieldContainer>

          <div className="flex flex-col">
            <Button disabled={isSubmitting} variant="default" type="submit">
              Add to Robe
            </Button>
          </div>

          {createItem.isError && (
            <div>
              <Alert variant="destructive">
                <AlertTitle>
                  {createItem.error
                    ? createItem.error.message
                    : "Error adding item"}
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
