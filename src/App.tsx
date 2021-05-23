import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, fetchCategories } from "./store/slices/categories";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { fetchImages, ImageStatus, selectImages } from "./store/slices/images";
import { RootState } from "./store/createReducer";
import { AuthProviderContext } from "./containers/AuthProvider";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [viewedCategoryId, setViewedCategoryId] = useState<null | number>(null);
  const { isAuthenticated } = useContext(AuthProviderContext);
  const images = useSelector(selectImages);
  const imageMeta = useSelector<
    RootState,
    { title: string | null; urlName: string | null; imageStatus: ImageStatus }
  >((state) => ({
    title: state.images.title,
    urlName: state.images.urlName,
    imageStatus: state.images.status,
  }));

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCategories());
    }
  }, [isAuthenticated, dispatch]);

  if (imageMeta.imageStatus === "LOADING") {
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
              <ItemForm
                initialName={imageMeta.title || ""}
                initialUrl={imageMeta.urlName || ""}
                images={images}
                categories={categories}
                onSuccess={(categoryId) => {
                  setShowForm(false);
                  setViewedCategoryId(categoryId);
                }}
              ></ItemForm>
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
