import React, { FC, useState, useEffect } from "react";
import { Formik } from "formik";
import DoneIcon from "@material-ui/icons/Done";
import ItemService from "../../services/ItemService";
import CategoryService from "../../services/CategoryService";
import { Category } from "../../models/Category";

const getDefaultFormValues = () => {
  const windowFake: any = window;
  const name = windowFake.$$title;
  const url = windowFake.$$urlName;
  return {
    name,
    url,
  };
};

const ItemForm: FC<{}> = () => {
  const defaultFormValues = getDefaultFormValues();
  const [itemAdded, setItemAdded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    CategoryService.getCategories().then((categoriesRes) => {
      setCategories(categoriesRes);
    });
  }, []);

  return (
    <Formik
      initialValues={{
        name: "",
        price: 0,
        category: "dress",
        ...defaultFormValues,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        await ItemService.create(values);
        setItemAdded(true);
        setSubmitting(false);
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
                <select
                  name="category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category}
                  className="form-control"
                >
                  {categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {" "}
                        {category.name}{" "}
                      </option>
                    );
                  })}
                </select>
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
            </form>
          </div>
        );
      }}
    </Formik>
  );
};

export default ItemForm;
