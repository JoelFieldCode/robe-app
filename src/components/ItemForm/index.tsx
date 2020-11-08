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
import * as Yup from "yup";

const itemSchema = Yup.object().shape({
  price: Yup.number().required(),
  category_id: Yup.number().required(),
  url: Yup.string().required(),
  name: Yup.string().required(),
  image_url: Yup.string().required(),
});

interface ItemValues {
  price: number;
  category_id: null | number;
  url: string;
  name: string;
  image_url: string;
}

const ItemForm: FC<{
  categories: Category[];
  initialUrl: string;
  initialName: string;
  selectedImage: string;
  onSuccess: (categoryId: number) => void;
}> = ({ categories, onSuccess, initialName, initialUrl, selectedImage }) => {
  const dispatch = useDispatch();
  const [itemAdded, setItemAdded] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const initialValues: ItemValues = {
    price: 0,
    category_id: null,
    url: initialUrl,
    name: initialName,
    image_url: selectedImage,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={itemSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setError(false);

        // @ts-ignore
        dispatch(addItem(values))
          // @ts-ignore
          .then(unwrapResult)
          .then((originalPromiseResult: any) => {
            if (values.category_id) {
              setItemAdded(true);
              onSuccess(values.category_id);
            }
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
        handleChange,
        isValid,
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
                  disabled={isSubmitting || !isValid}
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
