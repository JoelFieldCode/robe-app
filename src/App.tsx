import React, { useState } from "react";
import "./App.css";
import ItemForm from "./components/ItemForm/index";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import Header from "./components/Header";
import CategoriesList from "./components/CategoriesList";
import { useQuery } from "@tanstack/react-query";
import { grabImages } from "./services/ImageGrabber";
import { uniqueId } from "lodash";
import { ImageMetaPayload } from "./models/Images";
import ImageSelector from "./components/ImageSelector";
import { graphql } from "./gql/gql";
import { client } from "./services/GraphQLClient";

const getCategoriesQueryDocument = graphql(/* GraphQL */ `
  query getCategories {
    getCategories {
      name
      id
      image_url
      itemCount
    }
  }
`);

const App: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [viewedCategoryId, setViewedCategoryId] = useState<null | number>(null);

  const categoriesQuery = useQuery(["categories"], async () =>
    client.request(getCategoriesQueryDocument)
  );

  const categories = categoriesQuery.data?.getCategories;

  const imagesQuery = useQuery<ImageMetaPayload>(["images"], async () => {
    const response = await grabImages();
    const { title, urlName, images } = response;

    return {
      title,
      urlName,
      images: images.map((image) => ({
        url: image,
        id: uniqueId(),
      })),
    };
  });

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
              <ImageSelector images={imagesQuery.data?.images ?? []}>
                <ItemForm
                  initialName={imagesQuery.data?.title ?? ""}
                  initialUrl={imagesQuery.data?.urlName || ""}
                  categories={categories ?? []}
                  onSuccess={(categoryId) => {
                    setShowForm(false);
                    setViewedCategoryId(categoryId);
                  }}
                />
              </ImageSelector>
            </Grid>
          ) : (
            <Grid item xs>
              <CategoriesList
                viewedCategoryId={viewedCategoryId}
                setViewedCategoryId={setViewedCategoryId}
                categories={categories ?? []}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default App;
