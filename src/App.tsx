import React, { useEffect } from "react";
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
  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

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
      <Container>
        <Grid container>
          <Grid item xs>
            <CategoriesList categories={categories} />
          </Grid>
          {/* <Grid item xs>
            <ItemForm categories={categories}></ItemForm>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
};

export default App;
