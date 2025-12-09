import React, { FC, useCallback, useRef } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
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
import { FieldContainer } from "../FieldContainer";

const itemSchema = Yup.object({
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number"),
  category: Yup.object({
    id: Yup.number()
      .required("Please select a category")
      .typeError("Please select a category"),
  })
    .required("Please select a category")
    .typeError("Please select a category"),
  url: Yup.string().url().required("Please enter a URL"),
  name: Yup.string().required("Please enter a name"),
  image: Yup.object({
    url: Yup.string().optional().nullable(),
    file: Yup.mixed().optional().nullable(),
  })
    .optional()
    .nullable(),
});

type ItemSchema = typeof itemSchema;

export type FormValues = Yup.InferType<ItemSchema>;
export type CategoryOptionType = { id: number; name: string };

const uploadImageMutation = graphql(/* GraphQL */ `
  mutation uploadImage($image: File!) {
    uploadImage(image: $image)
  }
`);

export type SubmitFormValues = Omit<FormValues, "image"> & {
  image_url?: string | null;
};

export type ItemFormProps = {
  defaultUrl?: string | null;
  defaultName?: string | null;
  defaultImage?: File | string | null;
  defaultPrice?: number | null;
  defaultCategory?: FormValues["category"] | null;
  onSubmit: (formValues: SubmitFormValues) => Promise<any>;
  submitText: string;
  error?: Error | null;
};

const ItemForm: FC<ItemFormProps> = ({
  defaultName,
  defaultUrl,
  defaultImage,
  defaultPrice,
  defaultCategory,
  submitText = "Add to Robe",
  error,
  onSubmit,
}) => {
  const { reset } = useShareImageStore();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: yupResolver(itemSchema),
    defaultValues: {
      url: defaultUrl ?? "",
      name: defaultName ?? "",
      price: defaultPrice ?? undefined,
      category: defaultCategory ?? undefined,
      image: defaultImage
        ? {
            file: typeof defaultImage === "string" ? null : defaultImage,
            url: typeof defaultImage === "string" ? defaultImage : null,
          }
        : null,
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
    categories?.map(({ id, name }) => ({
      id,
      name,
    })) ?? [];

  const onBeforeSubmit = useCallback<SubmitHandler<FormValues>>(
    async (values) => {
      try {
        // does this throw if there's an error?
        let image_url = values.image
          ? // TODO catch error
            values.image.url
            ? values.image.url
            : values.image.file
            ? await client
                .request({
                  document: uploadImageMutation,
                  variables: { image: values.image.file },
                })
                .then((res) => res.uploadImage)
            : null
          : null;

        await onSubmit({ ...values, image_url });
        reset();
      } catch (error) {
        console.log({ error });
      }
    },
    [navigate]
  );

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  const { isSubmitting } = form.formState;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onBeforeSubmit)}>
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
                        {value.file ? (
                          <img
                            className="w-full object-contain max-h-96"
                            src={URL.createObjectURL(value.file)}
                          />
                        ) : (
                          value.url && (
                            <img
                              className="w-full object-contain max-h-96"
                              src={value.url}
                            />
                          )
                        )}
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
                        onChange({ file: event.target.files?.[0], url: null });
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
              {submitText}
            </Button>
          </div>

          {error && (
            <div>
              <Alert variant="destructive">
                <AlertTitle>{error.message}</AlertTitle>
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
