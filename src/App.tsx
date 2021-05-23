import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { fetchImages, ImageStatus, selectImages } from "./store/slices/images";
import { RootState } from "./store/createReducer";
import { AuthProviderContext } from "./containers/AuthProvider";
import { useQuery } from "react-query";
import API from "./services/Api";
import { Category } from "./models/Category";

const App: React.FC = () => {
  const dispatch = useDispatch();
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

  const { isLoading, data } = useQuery<Category[]>(
    ["categories"],
    () => API.get<Category[]>("/api/categories").then((res) => res.data),
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  if (imageMeta.imageStatus === "LOADING" || isLoading) {
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
                categories={data ?? []}
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
                categories={data ?? []}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
