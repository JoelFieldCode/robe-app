import React, { useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";

import { useDispatch, useSelector } from "react-redux";
import { loginAsync, userAuth } from "./store/slices/user";
import { selectCategories, fetchCategories } from "./store/slices/categories";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector(userAuth);
  const categories = useSelector(selectCategories);
  const [images, setImages] = useState(null);
  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

  useEffect(() => {
    // @ts-ignore
    const images = chrome?.extension?.getBackgroundPage().$$images ?? null;
    setImages(images);
  }, []);

  console.log(images);

  useEffect(() => {
    if (auth) {
      dispatch(fetchCategories());
    }
  }, [auth]);

  if (!auth || !categories.length) {
    return (
      <Grid
        style={{ height: "100%" }}
        container
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <>
      <Header />
      <Container maxWidth="xs">
        <Grid container>
          {/* <Grid item xs>
            <CategoriesList categories={categories} />
          </Grid> */}
          <Grid item xs>
            <ItemForm images={images} categories={categories}></ItemForm>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
