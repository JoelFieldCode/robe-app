import React, { FC, useState } from "react";
import { Formik } from "formik";
import DoneIcon from "@material-ui/icons/Done";
import { Category } from "../../models/Category";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/items";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const getDefaultFormValues = () => {
  const windowFake: any = window;
  const name = windowFake.$$title;
  const url = windowFake.$$urlName;
  return {
    name,
    url,
  };
};

const ItemForm: FC<{ categories: Category[]; images: string[] | null }> = ({
  categories,
  images,
}) => {
  const defaultFormValues = getDefaultFormValues();
  const dispatch = useDispatch();
  const [itemAdded, setItemAdded] = useState(false);
  const [error, setError] = useState<boolean>(false);

  if (!images) {
    return null;
  }
  return (
    <Grid container>
      {images.map((image) => {
        return (
          <Grid item xs={12}>
            <img src={image} style={{ maxHeight: "200px", width: "auto" }} />
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Formik
      initialValues={{
        price: 0,
        category_id: 1,
        ...defaultFormValues,
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
            <Grid container spacing={3}>
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

              <Grid item container xs={12} alignItems="center" spacing={3}>
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    variant="contained"
                    type="submit"
                    color="primary"
                  >
                    Add to Robe
                  </Button>
                </Grid>

                {itemAdded && !error && <DoneIcon color="primary" />}
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
