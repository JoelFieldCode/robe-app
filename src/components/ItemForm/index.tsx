import React, { FC, useEffect, useState } from "react";
import { Formik } from "formik";
import { Category } from "../../models/Category";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/items";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Grid, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as Yup from "yup";
import ImageSelector from "../ImageSelector";

import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { createCategory } from "../../store/slices/categories";
import { AppDispatch } from "../../store";

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
  images: string[];
  onSuccess: (categoryId: number) => void;
}> = ({ categories, onSuccess, initialName, initialUrl, images }) => {
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const initialValues: ItemValues = {
    price: 0,
    category: null,
    url: initialUrl,
    name: initialName,
    image_url: selectedImage,
  };

  useEffect(() => {
    if (!selectedImage) {
      document.documentElement.style.width = "800px";
      document.documentElement.style.height = "600px";
    } else {
      document.documentElement.style.width = "400px";
      document.documentElement.style.height = "400px";
    }
    return () => {
      document.documentElement.style.width = "400px";
      document.documentElement.style.height = "400px";
    };
  }, [selectedImage]);

  if (!selectedImage) {
    return (
      <ImageSelector images={images} setSelectedImage={setSelectedImage} />
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={itemSchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (!values.category || !values.image_url) {
          return;
        }
        setSubmitting(true);
        setError(false);

        let category_id;

        if (!values.category.id) {
          const category = await dispatch(
            createCategory({
              name: values.category.name,
              image_url: values.image_url,
            })
          ).then(unwrapResult);
          category_id = category.id;
        } else {
          category_id = values.category.id;
        }

        await dispatch(
          addItem({
            name: values.name,
            category_id,
            url: values.url,
            price: values.price,
            image_url: values.image_url,
          })
        )
          .then(unwrapResult)
          .then((item) => {
            onSuccess(item.category_id);
          })
          .catch((serializedError: any) => {
            setError(true);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({
        values,
        handleChange,
        isValid,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  fullWidth
                  name="price"
                  type="number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  value={values.category}
                  onChange={(event: any, newValue: any) => {
                    if (typeof newValue === "string") {
                      setFieldValue("category", {
                        name: newValue,
                      });
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setFieldValue("category", {
                        name: newValue.inputValue,
                      });
                    } else if (newValue && newValue.name && newValue.id) {
                      setFieldValue("category", {
                        name: newValue.name,
                        id: newValue.id,
                      });
                    } else {
                      setFieldValue("category", null);
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
                  options={categories.map(
                    (category) =>
                      ({
                        name: category.name,
                        id: category.id,
                      } as CategoryOptionType)
                  )}
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
                    <TextField
                      {...params}
                      label="Category"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  disabled={isSubmitting || !isValid || !values.category}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  Add to Robe
                </Button>
              </Grid>

              {!isSubmitting && error && (
                <Grid item xs={12}>
                  <Alert severity="error">
                    Error adding item - please check your inputs
                  </Alert>
                </Grid>
              )}
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default ItemForm;
