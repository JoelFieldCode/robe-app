import React, { useEffect, useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { useQuery } from "react-query";
import API from "./services/Api";
import { Category } from "./models/Category";
import { grabImages } from "./services/ImageGrabber";
import { uniqueId } from "lodash";
import { ImageMetaPayload } from "./models/Images";

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewedCategoryId, setViewedCategoryId] = useState<null | number>(null);

  const categoriesQuery = useQuery<Category[]>(["categories"], () =>
    API.get<Category[]>("/api/categories").then((res) => res.data)
  );

  const imagesQuery = useQuery<ImageMetaPayload>(["images"], async () => {
    const response = await grabImages();
    const { title, urlName, images, type } = response;

    return {
      title,
      urlName,
      images: images.map((image) => ({
        url: image,
        id: uniqueId(),
      })),
      type,
    };
  });

  useEffect(() => {
    if (imagesQuery.data?.type === "imageSelected") {
      setSelectedImage(imagesQuery.data?.images[0].url);
    }
  }, [imagesQuery.data]);

  if (imagesQuery.isLoading || categoriesQuery.isLoading) {
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
                initialName={imagesQuery.data?.title ?? ""}
                initialUrl={imagesQuery.data?.urlName || ""}
                images={imagesQuery.data?.images ?? []}
                categories={categoriesQuery.data ?? []}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                onSuccess={(categoryId) => {
                  setShowForm(false);
                  setViewedCategoryId(categoryId);
                  setSelectedImage(null);
                }}
              ></ItemForm>
            </Grid>
          ) : (
            <Grid item xs>
              <CategoriesList
                viewedCategoryId={viewedCategoryId}
                setViewedCategoryId={setViewedCategoryId}
                categories={categoriesQuery.data ?? []}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
