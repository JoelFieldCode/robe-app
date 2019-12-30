import React, { Component } from "react";
import { Formik } from "formik";

import ItemService from "../../services/ItemService.ts";

class ItemForm extends Component {
  getDefaultFormValues() {
    const name = window.$$pathName;
    const url = window.$$urlName;
    return {
      name,
      url
    };
  }
  render() {
    const defaultFormValues = this.getDefaultFormValues();
    return (
      <Formik
        initialValues={{
          name: "",
          price: 0,
          category: "dress",
          ...defaultFormValues
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await ItemService.create(values);
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
          isSubmitting
          /* and other goodies */
        }) => (
          <div className="w-50 m-auto pt-6">
            <form>
              <div className="mb-3">
                <label> Price</label>
                <input
                  name="price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.price}
                  className="form-control"
                  type="number"
                ></input>
              </div>
              <div className="mb-3">
                <label>Name</label>
                <input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="form-control"
                  type="text"
                ></input>
              </div>
              <div className="mb-3">
                <label>Category</label>
                <select
                  name="category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category}
                  className="form-control"
                >
                  <option value="shirt">Shirt</option>
                  <option value="dress"> Dress</option>
                </select>
              </div>

              <div>
                <button
                  disabled={isSubmitting}
                  type="button"
                  onClick={submitForm}
                  className="btn btn-primary"
                >
                  Submit Item
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    );
  }
}

export default ItemForm;
