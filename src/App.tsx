import React, { useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";

import { useDispatch, useSelector } from "react-redux";
import { loginAsync, userAuth } from "./store/slices/user";
import { selectCategories, fetchCategories } from "./store/slices/categories";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { grabImages } from "./services/ImageGrabber";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector(userAuth);
  const categories = useSelector(selectCategories);
  const [images, setImages] = useState<string[] | null>(null);
  const [initialUrl, setInitialUrl] = useState<string>("");
  const [initialName, setInitialName] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [viewedCategoryId, setViewedCategoryId] = useState<null | number>(null);
  useEffect(() => {
    dispatch(loginAsync());
  }, [dispatch]);

  useEffect(() => {
    grabImages().then((res) => {
      setImages(res.images);
      setInitialName(res.title);
      setInitialUrl(res.urlName);
    });
  }, []);

  useEffect(() => {
    if (auth) {
      dispatch(fetchCategories());
    }
  }, [auth, dispatch]);

  if (!auth || !images) {
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
      <Header setShowForm={setShowForm} />
      <Container maxWidth={false} style={{ padding: 40, paddingTop: 16 }}>
        <Grid container>
          {showForm ? (
            <Grid item xs>
              {images && (
                <ItemForm
                  initialName={initialName}
                  initialUrl={initialUrl}
                  onSuccess={(categoryId) => {
                    setShowForm(false);
                    setViewedCategoryId(categoryId);
                  }}
                  images={images}
                  categories={categories}
                ></ItemForm>
              )}
            </Grid>
          ) : (
            <Grid item xs>
              <CategoriesList
                viewedCategoryId={viewedCategoryId}
                setViewedCategoryId={setViewedCategoryId}
                categories={categories}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
