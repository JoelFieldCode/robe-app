import { FC, useCallback, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Category } from "../../models/Category";
import { Button, Grid, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import API from "../../services/Api";

import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { useMutation, useQueryClient } from "react-query";
import { CreateItemRequest } from "../../models/Item";
import { ImageSelectorContext } from "../ImageSelector/context";

const itemSchema = Yup.object().shape({
  price: Yup.number().required(),
  category: Yup.object()
    .shape({
      name: Yup.string().required(),
    })
    .nullable(false)
    .default(null)
    .required(),
  url: Yup.string().required(),
  name: Yup.string().required(),
  image_url: Yup.string().required(),
});

interface CategoryOptionType {
  name: string;
  id?: number;
  inputValue?: string;
}

interface ItemValues {
  price: number;
  category: null | CategoryOptionType;
  url: string;
  name: string;
  image_url: string | null;
}

const filter = createFilterOptions<CategoryOptionType>();

const ItemForm: FC<{
  categories: Category[];
  initialUrl: string;
  initialName: string;
  onSuccess: (categoryId: number) => void;
}> = ({ categories, onSuccess, initialName, initialUrl }) => {
  const [error, setError] = useState<boolean>(false);
  const { selectedImage } = useContext(ImageSelectorContext);
  const queryClient = useQueryClient();
  const initialValues: ItemValues = {
    price: 0,
    category: null,
    url: initialUrl,
    name: initialName,
    image_url: selectedImage,
  };
  const { register, handleSubmit, control, formState } = useForm<ItemValues>({
    resolver: yupResolver(itemSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const categoryOptions: CategoryOptionType[] = categories.map((category) => ({
    name: category.name,
    id: category.id,
  }));

  const createCategory = useMutation(
    (category: { name: string; image_url: string }) =>
      API.post<Category>("/api/categories", category)
  );

  const createItem = useMutation((itemReq: CreateItemRequest) =>
    API.post(`/api/categories/${itemReq.category_id}/items`, itemReq)
  );

  const onSubmit = useCallback(async (values) => {
    if (!values.category || !values.image_url) {
      return;
    }

    let category_id: number;

    if (!values.category.id) {
      const category = await createCategory.mutateAsync({
        name: values.category.name,
        image_url: values.image_url,
      });
      category_id = category.data.id;
    } else {
      category_id = values.category.id;
    }

    await createItem
      .mutateAsync({
        name: values.name,
        category_id,
        url: values.url,
        price: values.price,
        image_url: values.image_url,
      })
      .then(() => queryClient.invalidateQueries("categories"))
      .then(() => {
        onSuccess(category_id);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

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
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Name" {...register("name")} type="text" />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                onChange={(event: any, newValue: any) => {
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

        {/* {!isSubmitting && error && (
          <Grid item xs={12}>
            <Alert severity="error">
              Error adding item - please check your inputs
            </Alert>
          </Grid>
        )} */}
      </Grid>
    </form>
  );
};

export default ItemForm;
