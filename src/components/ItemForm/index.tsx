import React, { FC, useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Category,
  CreateCategoryInput,
  CreateItemInput,
} from "../../gql/graphql";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const itemSchema = Yup.object({
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number"),
  category: Yup.object({
    name: Yup.string().required(),
    id: Yup.number().optional().nullable(),
    inputValue: Yup.string().optional().nullable(),
  })
    .required("Please select a category")
    .typeError("Please select a category"),
  url: Yup.string().required(),
  name: Yup.string().required("Name is required"),
  image_url: Yup.string().optional(),
});

type FormValues = Yup.InferType<typeof itemSchema>;
type CategoryOptionType = FormValues["category"];

// const filter = createFilterOptions<CategoryOptionType>();

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
  categories: Category[];
  initialUrl: string;
  initialName: string;
  onSuccess: (categoryId: number) => void;
  selectedImage?: string;
}> = ({ categories, onSuccess, initialName, initialUrl, selectedImage }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, formState } = useForm<FormValues>({
    resolver: yupResolver(itemSchema),
    defaultValues: {
      url: initialUrl,
      name: initialName,
      image_url: selectedImage,
    },
    mode: "onChange",
  });

  const categoryOptions: CategoryOptionType[] = categories.map((category) => ({
    name: category.name,
    id: category.id,
    inputValue: undefined,
  }));

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
      let categoryId = values.category.id;
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

      onSuccess(categoryId);
    },
    [onSuccess, queryClient, createCategory, createItem]
  );

  const hasError = createCategory.isError || createItem.isError;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="twflex twflex-col twgap-6">
        <div className="twgrid tww-full twmax-w-sm twitems-center twgap-1.5">
          <Label htmlFor="price">Price</Label>
          <Input type="number" {...register("price")} />
          <ErrorMessage
            name="price"
            errors={formState.errors}
            render={({ message }) => (
              <p className="twtext-red-500">{message}</p>
            )}
          />
        </div>
        <div className="twgrid tww-full twmax-w-sm twitems-center twgap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" {...register("name")} />
          <ErrorMessage
            name="name"
            errors={formState.errors}
            render={({ message }) => (
              <p className="twtext-red-500">{message}</p>
            )}
          />
        </div>
        <div>
          <Controller
            name="category"
            control={control}
            render={({ field }) => <>TODO</>}
            //               <Autocomplete
            //     value={field.value}
            //     onChange={(_event: any, newValue: any) => {
            //       if (typeof newValue === "string") {
            //         field.onChange({
            //           ...field.value,
            //           name: newValue,
            //         });
            //       } else if (newValue && newValue.inputValue) {
            //         // Create a new value from the user input
            //         field.onChange({
            //           ...field.value,
            //           name: newValue.inputValue,
            //         });
            //       } else if (newValue && newValue.name && newValue.id) {
            //         field.onChange({
            //           name: newValue.name,
            //           id: newValue.id,
            //         });
            //       } else {
            //         field.onChange(null);
            //       }
            //     }}
            //     filterOptions={(options, params) => {
            //       const filtered = filter(options, params);

            //       // Suggest the creation of a new value
            //       if (params.inputValue !== "") {
            //         filtered.push({
            //           inputValue: params.inputValue,
            //           name: `Add "${params.inputValue}"`,
            //           id: null,
            //         });
            //       }

            //       return filtered;
            //     }}
            //     selectOnFocus
            //     id="free-solo-with-text-demo"
            //     options={categoryOptions}
            //     getOptionLabel={(option) => {
            //       // Value selected with enter, right from the input
            //       if (typeof option === "string") {
            //         return option;
            //       }
            //       // Add "xxx" option created dynamically
            //       if (option.inputValue) {
            //         return option.inputValue;
            //       }
            //       // Regular option
            //       return option.name;
            //     }}
            //     renderOption={(option) => option.name}
            //     style={{ width: 300 }}
            //     freeSolo
            //     renderInput={(params) => (
            //       <TextField {...params} label="Category" variant="outlined" />
            //     )}
            //   />
            // )}
          />
          <ErrorMessage
            name="category"
            errors={formState.errors}
            render={({ message }) => (
              <p className="twtext-red-500">{message}</p>
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
  );
};

export default ItemForm;
