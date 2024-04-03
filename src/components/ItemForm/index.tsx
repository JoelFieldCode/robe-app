import { FC, useCallback, useContext } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Category,
  CreateCategoryInput,
  CreateItemInput,
} from "../../gql/graphql";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageSelectorContext } from "../ImageSelector/context";
import { ErrorMessage } from "@hookform/error-message";
import { graphql } from "../../gql/gql";
import { client } from "../../services/GraphQLClient";

const itemSchema = Yup.object().shape({
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number"),
  category: Yup.object()
    .shape({
      name: Yup.string().required(),
    })
    .nullable(false)
    .default(null)
    .required("Please select a category")
    .typeError("Please select a category"),
  url: Yup.string().required(),
  name: Yup.string().required("Name is required"),
  image_url: Yup.string().required(),
});

interface CategoryOptionType {
  name: string;
  id?: number;
  inputValue?: string;
}

interface ItemValues {
  price: number;
  category: CategoryOptionType;
  url: string;
  name: string;
  image_url: string;
}

const filter = createFilterOptions<CategoryOptionType>();

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
}> = ({ categories, onSuccess, initialName, initialUrl }) => {
  const { selectedImage } = useContext(ImageSelectorContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, formState } = useForm<ItemValues>({
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

  const createItem = useMutation((createItemInput: CreateItemInput) =>
    client.request({
      document: createItemMutation,
      variables: { input: createItemInput },
    })
  );

  const onSubmit = useCallback<SubmitHandler<ItemValues>>(
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
      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <TextField
            label="Price"
            fullWidth
            type="number"
            {...register("price")}
          />
          <ErrorMessage
            name="price"
            errors={formState.errors}
            render={({ message }) => (
              <Typography variant="body2" style={{ color: "red" }}>
                {message}
              </Typography>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Name" {...register("name")} type="text" />
          <ErrorMessage
            name="name"
            errors={formState.errors}
            render={({ message }) => (
              <Typography variant="body2" style={{ color: "red" }}>
                {message}
              </Typography>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                onChange={(_event: any, newValue: any) => {
                  if (typeof newValue === "string") {
                    field.onChange({
                      ...field.value,
                      name: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    field.onChange({
                      ...field.value,
                      name: newValue.inputValue,
                    });
                  } else if (newValue && newValue.name && newValue.id) {
                    field.onChange({
                      name: newValue.name,
                      id: newValue.id,
                    });
                  } else {
                    field.onChange(null);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  // Suggest the creation of a new value
                  if (params.inputValue !== "") {
                    filtered.push({
                      inputValue: params.inputValue,
                      name: `Add "${params.inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                id="free-solo-with-text-demo"
                options={categoryOptions}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.name;
                }}
                renderOption={(option) => option.name}
                style={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Category" variant="outlined" />
                )}
              />
            )}
          />
          <ErrorMessage
            name="category"
            errors={formState.errors}
            render={({ message }) => (
              <Typography variant="body2" style={{ color: "red" }}>
                {message}
              </Typography>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            disabled={formState.isSubmitting || !formState.isValid}
            variant="contained"
            type="submit"
            color="primary"
          >
            Add to Robe
          </Button>
        </Grid>

        {hasError && (
          <Grid item xs={12}>
            <Alert severity="error">
              Error adding item - please check your inputs
            </Alert>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default ItemForm;
