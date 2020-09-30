import React, { FC, useState, useEffect } from "react";
import { Formik, Field } from "formik";
import DoneIcon from "@material-ui/icons/Done";
import { Category } from "../../models/Category";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/items";
import { unwrapResult } from "@reduxjs/toolkit";

const getDefaultFormValues = () => {
  const windowFake: any = window;
  const name = windowFake.$$title;
  const url = windowFake.$$urlName;
  return {
    name,
    url,
  };
};

const ItemForm: FC<{ categories: Category[] }> = ({ categories }) => {
  const defaultFormValues = getDefaultFormValues();
  const dispatch = useDispatch();
  const [itemAdded, setItemAdded] = useState(false);
  const [error, setError] = useState<boolean>(false);

  return (
    <Formik
      initialValues={{
        name: "",
        price: 0,
        category_id: 1,
        ...defaultFormValues,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        setError(false);
        try {
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
        } catch (err) {
          setError(true);
        } finally {
          setSubmitting(false);
        }
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
        /* and other goodies */
      }) => {
        return (
          <div className="w-50 m-auto pt-6">
            <form>
              <div className="mb-3">
                <label>Price </label>
                <input
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  className="form-control"
                  type="number"
                />
              </div>
              <div className="mb-3">
                <label>Name </label>
                <input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="form-control"
                  type="text"
                />
              </div>
              <div className="mb-3">
                <label>Category </label>
                <Field as="select" name="category_id" className="form-control">
                  {categories &&
                    categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {" "}
                          {category.name}{" "}
                        </option>
                      );
                    })}
                </Field>
              </div>

              <div className="d-flex align-items-center">
                <button
                  disabled={isSubmitting}
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary mr-3"
                >
                  Submit Item
                </button>
                {isSubmitting && (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {itemAdded && <DoneIcon />}
              </div>
              {!isSubmitting && error && (
                <div className="alert alert-danger mt-3" role="alert">
                  Error adding item - please check your inputs
                </div>
              )}
            </form>
          </div>
        );
      }}
    </Formik>
  );
};

export default ItemForm;
