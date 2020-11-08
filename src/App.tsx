import React, { useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";

import { useDispatch, useSelector } from "react-redux";
import { loginAsync, userAuth } from "./store/slices/user";
import { selectCategories, fetchCategories } from "./store/slices/categories";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  }, [auth]);

  if (!auth || !categories.length || !images) {
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
      <Container
        maxWidth={selectedImage ? "xs" : false}
        style={{ padding: 40 }}
      >
        {!selectedImage ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Select an image
            </Typography>
            <Grid container spacing={2}>
              {images.map((image) => {
                return (
                  <Grid
                    item
                    container
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    onClick={() => {
                      document.body.style.minWidth = "400px";
                      document.body.style.minHeight = "400px";
                      document.body.style.maxWidth = "400px";
                      document.body.style.maxHeight = "400px";
                      document.documentElement.style.minWidth = "400px";
                      document.documentElement.style.minHeight = "400px";
                      document.documentElement.style.maxWidth = "400px";
                      document.documentElement.style.maxHeight = "400px";
                      setSelectedImage(image);
                    }}
                  >
                    <img
                      src={image}
                      style={{
                        cursor: "pointer",
                        borderRadius: "6px",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        ) : (
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
                    selectedImage={selectedImage}
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
        )}
      </Container>
    </>
  );
};

export default App;
