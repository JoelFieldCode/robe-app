import React, { FC, useState } from "react";
import { Formik } from "formik";
import { Category } from "../../models/Category";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/items";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const ItemForm: FC<{
  categories: Category[];
  images: string[];
  initialUrl: string;
  initialName: string;
  onSuccess: (categoryId: number) => void;
}> = ({ categories, images, onSuccess, initialName, initialUrl }) => {
  const dispatch = useDispatch();
  const [itemAdded, setItemAdded] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!selectedImage) {
    return (
      <Grid container zeroMinWidth>
        {images.map((image) => {
          return (
            <Grid item xs={12} onClick={() => setSelectedImage(image)}>
              <img
                src={image}
                style={{
                  maxHeight: "200px",
                  maxWidth: "100%",
                  width: "auto",
                  height: "auto",
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <Formik
      initialValues={{
        price: 0,
        category_id: 1,
        url: initialUrl,
        name: initialName,
        image_url: selectedImage,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        setError(false);

        // @ts-ignore
        dispatch(addItem(values))
          // @ts-ignore
          .then(unwrapResult)
          .then((originalPromiseResult: any) => {
            setItemAdded(true);
            onSuccess(values.category_id);
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
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        submitForm,
        isSubmitting,
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    value={values.category_id}
                    onChange={handleChange}
                    name="category_id"
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.id}>{category.name} </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  disabled={isSubmitting}
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
